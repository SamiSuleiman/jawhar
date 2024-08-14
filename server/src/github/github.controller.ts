import { Controller, Get, Param } from '@nestjs/common';
import { FilesResDto, ProfileDto } from './github.model';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':username/files')
  async getFiles(@Param('username') username: string): Promise<FilesResDto> {
    const _gistFileUrls = await this.githubService.fetchGistFiles(username);
    return {
      posts: { list: _gistFileUrls.posts, count: _gistFileUrls.posts.length },
      config: _gistFileUrls.config,
    };
  }

  @Get(':username/profile')
  async getProfile(@Param('username') username: string): Promise<ProfileDto> {
    return await this.githubService.fetchProfile(username);
  }
}
