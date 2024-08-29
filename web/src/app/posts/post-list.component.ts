import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, tap } from 'rxjs';
import { SearchIconComponent } from '../ui/icons/search-icon.component';
import { LayoutComponent } from '../ui/layout.component';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  template: `
    <div class="flex gap-2">
      <label class="input input-bordered flex items-center gap-2 flex-grow">
        <input
          type="text"
          class="grow"
          placeholder="Search"
          [formControl]="searchCtrl"
        />
        <app-search-icon></app-search-icon>
      </label>
    </div>

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
    RouterLink,
    ReactiveFormsModule,
    AsyncPipe,
    SearchIconComponent,
    LayoutComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
  readonly $username = input.required<string>({ alias: 'username' });

  private readonly destroyRef = inject(DestroyRef);
  private readonly postService = inject(PostService);
  private readonly router = inject(Router);

  private readonly $internalPosts = signal<Post[]>([]);

  readonly searchCtrl = new FormControl('');
  readonly $posts = signal<Post[]>([]);

  async ngOnInit(): Promise<void> {
    const _posts = await this.getPosts(false);
    this.$posts.set(_posts);

    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(200),
        tap((search) => {
          const _posts = this.$internalPosts();
          this.$posts.set(
            search
              ? _posts.filter((post) =>
                  post.title.toLowerCase().includes(search.toLowerCase()),
                )
              : _posts,
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  async getPosts(refresh: boolean): Promise<Post[]> {
    const _posts = await this.postService.getParsedPosts(
      this.$username(),
      refresh,
    );
    this.$internalPosts.set(_posts);
    return _posts;
  }

  goto(title: string) {
    this.router.navigate([`/posts/${this.$username()}/${title}`]);
  }
}
