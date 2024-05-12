import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { GithubService } from '../github/github.service';
import { container } from '../app.consts';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">/user</a></li>
          <li><a [routerLink]="['/posts']">/posts</a></li>
          <li><a>/tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/']">exit</a>
        </li>
      </div>
    </app-navbar>
    <div [class]="container">
      @for (post of $posts(); track post) {
        <div class="card card-side bg-base-100 shadow-xl max-h-40">
          <figure>
            <img [src]="post.thumbnail" alt="Thumbnail" />
          </figure>
          <div class="card-body">
            <h2 class="card-title cursor-pointer hover:underline">
              {{ post.title }}
            </h2>
            <div class="flex gap-2 flex-wrap">
              @for (tag of post.tags.slice(0, 4); track tag) {
                <div class="badge badge-neutral">{{ tag }}</div>
              }
            </div>
          </div>
        </div>
      }
    </div>
    posts list
  `,
  selector: 'app-post-list',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
})
export class PostListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  readonly ghService = inject(GithubService);

  readonly container = container;

  readonly $posts = signal<Post[]>([]);

  constructor() {
    computed(() => console.log(this.$posts()));
  }

  async ngOnInit(): Promise<void> {
    if (!this.ghService.$profile()) this.router.navigate(['search']);
    await this.refreshPosts();
  }

  async refreshPosts(): Promise<void> {
    const _posts = await this.postService.getParsedPosts();
    this.$posts.set(_posts);
  }
}
