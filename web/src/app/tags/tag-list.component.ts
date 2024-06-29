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
import { TagService } from './tag.service';
import { SearchIconComponent } from '../ui/icons/search-icon.component';

@Component({
  template: `
    <app-navbar> </app-navbar>

    <label class="input input-bordered flex items-center gap-2 flex-grow">
      <input
        type="text"
        class="grow"
        placeholder="Search"
        [(value)]="$search"
      />
      <app-search-icon></app-search-icon>
    </label>
    <div
      class="max-h-[60vh] overflow-y-scroll p-1 flex justify-start items-center m-2"
    >
      <ul class="flex flex-col gap-2">
        @for (tag of $tags(); track tag) {
        <li class="hover:underline">
          <a (click)="goto(tag)">
            - <span>{{ tag }}</span>
          </a>
        </li>
        } @empty {
        <li>No tags found.</li>
        }
      </ul>
    </div>
  `,
  styles: ``,
  selector: 'app-tag-list',
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
export class TagListComponent implements OnInit {
  readonly $username = input.required<string>({ alias: 'username' });

  private readonly tagService = inject(TagService);
  private readonly router = inject(Router);

  private readonly $internalTags = signal<string[]>([]);

  readonly $isLoading = signal(false);

  readonly $search = toSignal<string | null>(
    new FormControl('').valueChanges.pipe(skip(1), debounceTime(400))
  );

  readonly $tags = computed(() => {
    const _tags = this.$internalTags();
    const _search = this.$search();
    return _search
      ? _tags.filter((post) =>
          post.toLowerCase().includes(_search.toLowerCase())
        )
      : _tags;
  });

  async ngOnInit(): Promise<void> {
    await this.getPosts(false);
  }

  async getPosts(refresh: boolean): Promise<void> {
    const _tags = await this.tagService.getUserTags(this.$username(), refresh);
    this.$internalTags.set(_tags);
  }

  goto(tag: string) {
    this.router.navigate([`/tags/${this.$username()}/${tag}`]);
  }
}
