import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { AxiosResponse } from 'axios';

@Injectable()
export class GithubService {
  private readonly githubBaseUrl = 'https://gist.github.com';

  constructor(private readonly httpService: HttpService) {}

  async fetchJawharGistFileUrls(username: string): Promise<string[]> {
    try {
      const _gistUrl = await this.fetchJawharGistUrl(username);
      const $ = cheerio.load(
        (
          await firstValueFrom(
            this.httpService.get(`${this.githubBaseUrl}${_gistUrl}`),
          )
        ).data,
      );

      return $('.file-actions > a')
        .toArray()
        .map((el) => $(el).attr('href'));
    } catch {
      return [];
    }
  }

  // TODO: maybe refactor this to return an observable instead?
  private async fetchJawharGistUrl(username: string): Promise<string> {
    let res: AxiosResponse;
    let page = 1;

    while (
      (res = await firstValueFrom(
        this.httpService.get(`${this.githubBaseUrl}/${username}?page=${page}`),
      ))
    ) {
      if (!res || !res.data || res.data.length === 0) return;
      const $ = cheerio.load(res.data);
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
      page++;
    }
  }
}
