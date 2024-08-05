import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { AxiosResponse } from 'axios';
import { ProfileDto } from './github.model';

@Injectable()
export class GithubService {
  private readonly githubGistBaseUrl = 'https://gist.github.com';
  private readonly githubBaseUrl = 'https://github.com';

  constructor(private readonly httpService: HttpService) {}

  async fetchGistFiles(username: string): Promise<string[]> {
    try {
      const _fileUrls = await this.fetchJawharGistFileUrls(username);

      return await Promise.all(
        _fileUrls.map(
          async (url) =>
            (
              await firstValueFrom(
                this.httpService.get<string>(`${this.githubGistBaseUrl}${url}`),
              )
            ).data,
        ),
      );
    } catch {
      return [];
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

  private async fetchJawharGistFileUrls(username: string): Promise<string[]> {
    const _gistUrl = await this.fetchJawharGistUrl(username);
    const $ = cheerio.load(
      (
        await firstValueFrom(
          this.httpService.get(`${this.githubGistBaseUrl}${_gistUrl}`),
        )
      ).data,
    );

    return $('.file-actions > a')
      .toArray()
      .map((el) => $(el).attr('href'))
      .filter((url) => {
        const _split = url.split('.');
        const _fileExtension = _split[_split.length - 1];
        return _fileExtension === 'md';
      });
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
}
