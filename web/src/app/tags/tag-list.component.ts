import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, debounceTime, skip, tap } from 'rxjs';
import { GithubService } from '../github/github.service';
import { NavbarComponent } from '../ui/navbar.component';
import { TagService } from './tag.service';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6 mb-4">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">/user</a></li>
          <li><a [routerLink]="['/posts']">/posts</a></li>
          <li><a [routerLink]="['/tags']">\\tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/']">exit</a>
        </li>
      </div>
    </app-navbar>

    <label class="input input-bordered flex items-center gap-2 flex-grow">
      <input
        type="text"
        class="grow"
        placeholder="Search"
        [formControl]="searchVal"
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
    <div
      class="max-h-[60vh] overflow-y-scroll p-1 flex justify-start items-center m-2"
    >
      <ul class="flex flex-col gap-2">
        @for (tag of _tags$ | async; track tag) {
        <li class="hover:underline">
          <a [routerLink]="['/tags', tag]">
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
  imports: [NavbarComponent, RouterLink, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent implements OnInit {
  private readonly ghService = inject(GithubService);
  private readonly router = inject(Router);
  readonly tagService = inject(TagService);

  readonly _tags$ = new BehaviorSubject<string[]>([]);

  readonly searchVal = new FormControl('');

  constructor() {
    this.searchVal.valueChanges
      .pipe(
        skip(1),
        debounceTime(400),
        tap((val) => {
          const _originalTags = this.tagService.$tags();
          if (!val) this._tags$.next(_originalTags);
          else
            this._tags$.next(
              _originalTags.filter((tag) =>
                tag.toLowerCase().includes(val.toLowerCase())
              )
            );
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (!this.ghService.$profile()) this.router.navigate(['search']);
    this._tags$.next(this.tagService.$tags());
  }
}
