import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GithubService } from '../github/github.service';
import { NavbarComponent } from '../ui/navbar.component';
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
    <div
      class="max-h-[60vh] overflow-y-scroll p-1 mt-4 flex justify-start items-center"
    >
      <ul class="flex flex-col gap-2">
        @for (post of $posts(); track post) {
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
          <li class="hover:underline">
            <a [routerLink]="['/posts', post.title]">
              - <span>{{ post.title }}</span>
            </a>
          </li>
        }
      </ul>
    </div>
  `,
  selector: 'app-post-list',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
})
export class PostListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly postService = inject(PostService);
  readonly ghService = inject(GithubService);

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
