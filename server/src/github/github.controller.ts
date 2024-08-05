import { Controller, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { Get } from '@nestjs/common';
import { ListResDto } from 'src/core/dtos/res.dto';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('posts/:username')
  async getPosts(
    @Param('username') username: string,
  ): Promise<ListResDto<string>> {
    const _gistFileUrls =
      await this.githubService.fetchJawharGistFileUrls(username);

    return { list: _gistFileUrls, count: _gistFileUrls.length };
  }
}
