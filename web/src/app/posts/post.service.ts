import { Injectable, inject } from '@angular/core';
import { GithubService } from '../github/github.service';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly ghService = inject(GithubService);

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
      const _profile = await this.ghService.getProfile(username);
      this.parsedPosts.set(username, _profile?.posts ?? []);
      return tags
        ? _profile?.posts.filter((p) => p.tags.some((t) => tags.includes(t))) ??
            []
        : _profile?.posts ?? [];
    }

    return [];
  }

  async getPost(username: string, title: string): Promise<Post | undefined> {
    let _userPosts = this.parsedPosts.get(username);
    if (!_userPosts) _userPosts = await this.getParsedPosts(username);
    return _userPosts.find((p) => p.title === title);
  }
}
