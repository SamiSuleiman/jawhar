import { Controller } from '@nestjs/common';
import { GithubService } from './github.service';
import { Get } from '@nestjs/common';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get()
  async getPosts() {
    return { res: await this.githubService.fetchJawharGistUrl() };
  }
}
