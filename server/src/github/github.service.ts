import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import * as customHeadingId from 'marked-custom-heading-id';
import { markedHighlight } from 'marked-highlight';
import { parse } from 'node-html-parser';
import { filter, firstValueFrom, map } from 'rxjs';
import { Post, PostMetadata, ProfileDto } from './github.model';
import { Config, ConfigSchema } from '../config/config.model';
import zu from 'zod_utilz';

@Injectable()
export class GithubService {
  private readonly marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      highlight(code, lang, _) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    }),
  ).use(customHeadingId(), {
    gfm: true,
    breaks: true,
  });

  private readonly githubGistBaseUrl = 'https://gist.github.com';
  private readonly githubBaseUrl = 'https://github.com';

  constructor(private readonly httpService: HttpService) {}

  async fetchGistFiles(username: string): Promise<
    | {
        posts: Post[];
        config: Config;
      }
    | undefined
  > {
    try {
      const _fileUrls = await this.fetchJawharGistFileUrls(username);
      const _posts = (
        await Promise.all(
          _fileUrls.posts.map(
            async (url) =>
              await firstValueFrom(
                this.httpService
                  .get<string>(`${this.githubGistBaseUrl}${url}`)
                  .pipe(map(async (res) => await this.parsePost(res.data))),
              ),
          ),
        )
      ).filter((post): post is Post => !!post);
      const _config = await firstValueFrom(
        this.httpService
          .get<string>(`${this.githubGistBaseUrl}${_fileUrls.config}`)
          .pipe(
            map((res: any) => {
              const _res = zu.stringToJSON().safeParse(res.data);
              if (!_res.success) return;
              const _config = ConfigSchema.safeParse(_res.data);
              return _config.data;
            }),
          ),
      );
      return {
        posts: _posts,
        config: _config,
      };
    } catch {
      return;
    }
  }

  async fetchProfile(username: string): Promise<ProfileDto | undefined> {
    try {
      const $ = cheerio.load(
        (
          await firstValueFrom(
            this.httpService.get(`${this.githubBaseUrl}/${username}`),
          )
        ).data,
      );

      return {
        avatarUrl: $('.avatar-user').attr('src'),
        displayName: $('.p-name').text() ?? $('.p-nickname').text(),
      };
    } catch {
      return;
    }
  }

  private async fetchJawharGistFileUrls(
    username: string,
  ): Promise<{ posts: string[]; config: string } | undefined> {
    const _gistUrl = await this.fetchJawharGistUrl(username);

    if (!_gistUrl) return;

    const $ = cheerio.load(
      (
        await firstValueFrom(
          this.httpService.get(`${this.githubGistBaseUrl}${_gistUrl}`),
        )
      ).data,
    );

    const _fileUrls = $('.file-actions > a')
      .toArray()
      .map((el) => $(el).attr('href'));

    const _postUrls = _fileUrls.filter((url) => {
      const _split = url.split('.');
      const _fileExtension = _split[_split.length - 1];
      return _fileExtension === 'md';
    });

    const _configUrl = _fileUrls.find((url) => {
      const _split = url.split('.');
      const _fileExtension = _split[_split.length - 1];
      return _fileExtension === 'json';
    });

    return {
      posts: _postUrls,
      config: _configUrl,
    };
  }

  // TODO: maybe refactor this to return an observable instead?
  private async fetchJawharGistUrl(username: string): Promise<string> {
    let _res: AxiosResponse;
    let _page = 1;

    while (
      (_res = await firstValueFrom(
        this.httpService.get(
          `${this.githubGistBaseUrl}/${username}?page=${_page}`,
        ),
      ))
    ) {
      if (!_res || !_res.data || _res.data.length === 0) return;
      const $ = cheerio.load(_res.data);
      const _snippetEl = $('.gist-snippet');

      if (_snippetEl.length === 0) return;

      const _el = _snippetEl
        .find('.gist-snippet-meta')
        .find('div > div > :nth-child(2) :nth-child(3)')
        .toArray()
        .find((el) => $(el).text().trim() === 'jawhar');

      if (!!_el)
        return $(_el.parent.parent.parent).find('ul > li > a').attr('href');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _page++;
    }
  }

  private async parsePost(post: string): Promise<Post | undefined> {
    try {
      const _metadata = await this.getPostMetadata(post);

      if (
        _metadata.title.length === 0 ||
        _metadata.tags.length === 0 ||
        _metadata.draft
      )
        return;

      if (_metadata.contentUrl.length > 0) {
        const _content = await firstValueFrom(
          this.httpService
            .get(_metadata.contentUrl, {
              responseType: 'text',
            })
            .pipe(
              filter((c): c is AxiosResponse => !!c),
              map((res) => res.data),
            ),
        );

        const _postInHTML = await this.marked.parse(_content);
        const html = parse(_postInHTML);
        _metadata.content = (
          await this.getPostMetadata(html.innerHTML)
        ).content;
      }

      return {
        title: _metadata.title,
        content: _metadata.content,
        tags: _metadata.tags,
        thumbnail: _metadata.thumbnail,
      };
    } catch {
      return;
    }
  }

  private async getPostMetadata(post: string): Promise<PostMetadata> {
    const _postInHTML = await this.marked.parse(post, {
      async: true,
      silent: false,
    });

    const html = parse(_postInHTML);

    const _title = html.getElementById('title');
    const _tags = html.getElementById('tags');
    const _thumbnail = html.getElementById('thumbnail');
    const _draft = html.getElementById('draft');
    const _contentUrl = html.getElementById('content');

    const _titleContent = _title?.textContent;
    const _tagsContent = _tags?.textContent?.split(',');
    const _thumbnailContent = _thumbnail?.textContent;
    const _draftContent = _draft?.textContent;
    const _content = _contentUrl?.textContent;

    _tags?.remove();
    _title?.remove();
    _thumbnail?.remove();
    _draft?.remove();
    _contentUrl?.remove();

    return {
      title: _titleContent ?? '',
      tags: _tagsContent ?? [],
      thumbnail: _thumbnailContent ?? undefined,
      draft: _draftContent === 'true',
      contentUrl: _content ?? '',
      content: html.innerHTML,
    };
  }
}
