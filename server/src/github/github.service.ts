import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { AxiosResponse } from 'axios';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  async fetchJawharGistUrl() {
    let res: AxiosResponse;
    let page = 1;

    while (
      (res = await firstValueFrom(
        this.httpService.get(`https://gist.github.com/samisul?page=${page}`),
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
