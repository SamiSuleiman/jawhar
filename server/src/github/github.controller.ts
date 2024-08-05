import { Controller, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { Get } from '@nestjs/common';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('posts/:username')
  async getPosts(@Param('username') username: string) {
    return { res: await this.githubService.fetchJawharGistFileUrls(username) };
  }
}
