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
import { NavbarComponent } from '../ui/navbar.component';
import { TagService } from './tag.service';

@Component({
  template: `
    <app-navbar> </app-navbar>

    <label class="input input-bordered flex items-center gap-2 flex-grow">
      <input
        type="text"
        class="grow"
        placeholder="Search"
        [formControl]="searchCtrl"
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

  private readonly destroyRef = inject(DestroyRef);
  private readonly tagService = inject(TagService);
  private readonly router = inject(Router);

  private readonly $internalTags = signal<string[]>([]);

  readonly searchCtrl = new FormControl('');
  readonly $tags = signal<string[]>([]);

  async ngOnInit(): Promise<void> {
    const _tags = await this.getTags(false);
    this.$tags.set(_tags);

    this.searchCtrl.valueChanges
      .pipe(
        debounceTime(200),
        tap((search) => {
          const _tags = this.$internalTags();
          this.$tags.set(
            search
              ? _tags.filter((tag) =>
                  tag.toLowerCase().includes(search.toLowerCase())
                )
              : _tags
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  async getTags(refresh: boolean): Promise<string[]> {
    const _tags = await this.tagService.getUserTags(this.$username(), refresh);
    this.$internalTags.set(_tags);
    return _tags;
  }

  goto(tag: string) {
    this.router.navigate([`/tags/${this.$username()}/${tag}`]);
  }
}
