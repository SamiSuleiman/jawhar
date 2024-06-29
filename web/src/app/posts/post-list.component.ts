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
import { SearchIconComponent } from '../ui/icons/search-icon.component';

@Component({
  template: `
    <app-navbar> </app-navbar>

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
        <app-search-icon></app-search-icon>
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
  imports: [
    NavbarComponent,
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    SearchIconComponent,
  ],
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
