import { Injectable, inject } from '@angular/core';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { GithubService } from '../github/github.service';
//@ts-ignore
import customHeadingId from 'marked-custom-heading-id';
import { Post, PostMetadata } from './post.model';
import { HttpClient } from '@angular/common/http';
import { catchError, filter, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly ghService = inject(GithubService);
  private readonly marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang, _) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  ).use(customHeadingId(), {
    gfm: true,
    breaks: true,
  });

  private readonly parsedPosts = new Map<string, Post[]>();

  async getParsedPosts(
    username: string,
    refresh = false,
    tags?: string[]
  ): Promise<Post[]> {
    const _userPosts = this.parsedPosts.get(username);

    if (_userPosts && !refresh)
      return tags
        ? _userPosts.filter((p) => p.tags.some((t) => tags.includes(t)))
        : _userPosts;

    if (!_userPosts || refresh) {
      const _parsedPosts = await this.parsePosts(username, refresh);
      this.parsedPosts.set(username, _parsedPosts);
      return tags
        ? _parsedPosts.filter((p) => p.tags.some((t) => tags.includes(t)))
        : _parsedPosts;
    }

    return [];
  }

  async getPost(username: string, title: string): Promise<Post | undefined> {
    let _userPosts = this.parsedPosts.get(username);
    if (!_userPosts) _userPosts = await this.getParsedPosts(username);
    return _userPosts.find((p) => p.title === title);
  }

  private async parsePosts(username: string, refresh = false): Promise<Post[]> {
    const _profile = await this.ghService.getProfile(username, refresh);

    if (!_profile) return [];

    const _parsed = (
      await Promise.all(
        _profile.posts.map(async (p) => await this.parsePost(p))
      )
    ).filter((p): p is Post => !!p);

    return _parsed;
  }

  private async parsePost(post: string): Promise<Post | undefined> {
    const _metadata = await this.getPostMetadata(post);

    if (
      _metadata.title.length === 0 ||
      _metadata.tags.length === 0 ||
      _metadata.draft
    )
      return;

    if (_metadata.contentUrl.length > 0) {
      const _content = await firstValueFrom(
        this.http
          .get(_metadata.contentUrl, {
            responseType: 'text',
          })
          .pipe(
            catchError(() => ''),
            filter((c): c is string => !!c)
          )
      );

      const _postInHTML = await this.marked.parse(_content);
      const html = new DOMParser().parseFromString(_postInHTML, 'text/html');
      _metadata.content = html.body.innerHTML;
    }

    return {
      title: _metadata.title,
      content: _metadata.content,
      tags: _metadata.tags,
      thumbnail: _metadata.thumbnail,
    };
  }

  private async getPostMetadata(post: string): Promise<PostMetadata> {
    const _postInHTML = await this.marked.parse(post);
    const html = new DOMParser().parseFromString(_postInHTML, 'text/html');

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

    return {
      title: _titleContent ?? '',
      tags: _tagsContent ?? [],
      thumbnail: _thumbnailContent ?? undefined,
      draft: _draftContent === 'true',
      contentUrl: _content ?? '',
      content: html.body.innerHTML,
    };
  }
}
