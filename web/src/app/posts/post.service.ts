import { Injectable, inject, signal } from '@angular/core';
import { GithubService } from '../github/github.service';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
//@ts-ignore
import customHeadingId from 'marked-custom-heading-id';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly ghService = inject(GithubService);
  private readonly marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang, _) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  ).use(customHeadingId(), {
    gfm: true,
    breaks: true,
  });

  private readonly parsedPosts = new Map<string, Post[]>();

  async getParsedPosts(username: string, refresh = false): Promise<Post[]> {
    const _userPosts = this.parsedPosts.get(username);

    if (_userPosts && !refresh) return _userPosts;

    if (!_userPosts || refresh) {
      const _parsedPosts = await this.parsePosts(username, refresh);
      this.parsedPosts.set(username, _parsedPosts);
      return _parsedPosts;
    }

    return [];
  }

  getPost(username: string, title: string): Post | undefined {
    return this.parsedPosts.get(username)?.find((p) => p.title === title);
  }

  private async parsePosts(username: string, refresh = false): Promise<Post[]> {
    const _profile = await this.ghService.getProfile(username, refresh);

    if (!_profile) return [];

    const _parsed = (
      await Promise.all(
        _profile.posts.map(async (p) => await this.parsePost(p))
      )
    ).filter((p): p is Post => !!p);

    return _parsed;
  }

  private async parsePost(post: string): Promise<Post | undefined> {
    const _postInHTML = await this.marked.parse(post);

    const html = new DOMParser().parseFromString(_postInHTML, 'text/html');

    const _title = html.getElementById('title');
    const _tags = html.getElementById('tags');
    const _thumbnail = html.getElementById('thumbnail');

    const _titleContent = _title?.textContent;
    const _tagsContent = _tags?.textContent?.split(',');
    const _thumbnailContent = _thumbnail?.textContent;

    if (!_titleContent || !_tagsContent) return;

    _title.remove();
    _tags?.remove();
    _thumbnail?.remove();

    return {
      title: _titleContent,
      content: html.body.innerHTML,
      tags: _tagsContent,
      thumbnail: _thumbnailContent ?? undefined,
    };
  }
}
