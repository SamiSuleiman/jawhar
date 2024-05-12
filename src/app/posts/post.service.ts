import { Injectable, inject, signal } from '@angular/core';
import { GithubService } from '../github/github.service';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly ghService = inject(GithubService);
  private readonly marked = marked;

  readonly $posts = signal<string[]>([]);

  async getPostsAsHTML(): Promise<string[]> {
    const _currPosts = this.$posts();
    if (_currPosts.length) return _currPosts;

    const _files = this.ghService.$gistFiles();
    if (!_files) return [];

    const _posts = await Promise.all(_files.map((p) => this.marked(p)));
    this.$posts.set(_posts);
    return _posts;
  }

  async refreshPosts(): Promise<string[]> {
    this.$posts.set([]);
    return await this.getPostsAsHTML();
  }
}
