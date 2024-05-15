import { Injectable, computed, inject } from '@angular/core';
import { PostService } from '../posts/post.service';
import { Post } from '../posts/post.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly postService = inject(PostService);

  readonly $tags = computed(() => {
    const _posts = this.postService.$posts();
    const _tags = new Set<string>();
    _posts.forEach((p) => p.tags.forEach((t) => _tags.add(t)));
    console.log('tags', Array.from(_tags));
    return Array.from(_tags);
  });

  getTagPosts(tag: string): Post[] {
    return this.postService.$posts().filter((p) => p.tags.includes(tag));
  }
}
