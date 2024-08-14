import { Controller, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { Get } from '@nestjs/common';
import { ListResDto } from 'src/core/dtos/res.dto';
import { Post, ProfileDto } from './github.model';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get(':username/files')
  async getFiles(
    @Param('username') username: string,
  ): Promise<ListResDto<Post>> {
    const _gistFileUrls = await this.githubService.fetchGistFiles(username);
    return { list: _gistFileUrls.posts, count: _gistFileUrls.posts.length };
  }

  @Get(':username/profile')
  async getProfile(@Param('username') username: string): Promise<ProfileDto> {
    return await this.githubService.fetchProfile(username);
  }
}
