import { Injectable, inject } from '@angular/core';
import { PostService } from '../posts/post.service';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly postService = inject(PostService);

  private readonly tags = new Map<string, string[]>();

  async getUserTags(username: string, refresh = false): Promise<string[]> {
    const _tags = this.tags.get(username);

    if (_tags && !refresh) return _tags;

    const _t = new Set<string>();

    const _userPosts = await this.postService.getParsedPosts(username, refresh);

    _userPosts.forEach((post) => {
      post.tags.forEach((t) => _t.add(t));
    });

    this.tags.set(username, Array.from(_t));

    return Array.from(_t);
  }
}
