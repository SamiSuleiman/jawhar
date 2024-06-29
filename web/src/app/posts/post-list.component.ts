import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, skip } from 'rxjs';
import { NavbarComponent } from '../ui/navbar.component';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6 mb-4">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">/user</a></li>
          <li><a [routerLink]="['/posts']">\\posts</a></li>
          <li><a [routerLink]="['/tags']">/tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/']">exit</a>
        </li>
      </div>
    </app-navbar>

    @if ($isLoading()) {
    <button class="btn btn-square">
      <span class="loading loading-spinner"></span>
    </button>
    } @else {
    <div class="flex gap-2">
      <label class="input input-bordered flex items-center gap-2 flex-grow">
        <input
          type="text"
          class="grow"
          placeholder="Search"
          [(value)]="$search"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
      <button class="btn" (click)="getPosts(true)">Reload</button>
    </div>
    }

    <div
      class="max-h-[60vh] overflow-y-scroll p-1 flex justify-start items-center m-2"
    >
      <ul class="flex flex-col gap-2">
        @for (post of $posts(); track post) {
        <li class="hover:underline">
          <a (click)="goto(post.title)">
            - <span>{{ post.title }}</span>
          </a>
        </li>
        } @empty {
        <li>No posts found.</li>
        }
      </ul>
    </div>
  `,
  selector: 'app-post-list',
  standalone: true,
  imports: [NavbarComponent, RouterLink, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
  readonly $username = input.required<string>({ alias: 'username' });

  private readonly postService = inject(PostService);
  private readonly router = inject(Router);

  private readonly $internalPosts = signal<Post[]>([]);

  readonly $isLoading = signal(false);

  readonly $search = toSignal<string | null>(
    new FormControl('').valueChanges.pipe(skip(1), debounceTime(400))
  );

  readonly $posts = computed(() => {
    const _posts = this.$internalPosts();
    const _search = this.$search();
    return _search
      ? _posts.filter((post) =>
          post.title.toLowerCase().includes(_search.toLowerCase())
        )
      : _posts;
  });

  async ngOnInit(): Promise<void> {
    await this.getPosts(false);
  }

  async getPosts(refresh: boolean): Promise<void> {
    const _posts = await this.postService.getParsedPosts(
      this.$username(),
      refresh
    );
    this.$internalPosts.set(_posts);
  }

  goto(title: string) {
    this.router.navigate([`/posts/${this.$username()}/${title}`]);
  }
}
