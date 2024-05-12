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
        <div class="card card-side bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              alt="Movie"
            />
          </figure>
          <div class="card-body">
            <h2 class="card-title">New movie is released!</h2>
            <p>Click the button to watch on Jetflix app.</p>
            <div class="card-actions justify-end">
              <button class="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
      }
    </div>
    posts list
  `,
  styles: ``,
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
    console.log(_posts);
    this.$posts.set(_posts);
  }
}
