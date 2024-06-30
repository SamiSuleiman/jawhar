import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { UiService } from './ui.service';

@Component({
  template: `
    <div class="navbar bg-base-100">
      <ul class="menu menu-horizontal px-1 flex w-full justify-between">
        <li class="hidden sm:block">
          <details>
            <summary class="font-extrabold text-2xl">ج</summary>
            <ul class="bg-base-100 rounded-t-none p-2">
              <li class="w-60">
                <a
                  class="no-underline"
                  target="_blank"
                  href="https://github.com/samisul/jawhar"
                  >GitHub</a
                >
              </li>
              <li>
                <a
                  class="no-underline"
                  target="_blank"
                  href="https://github.com/samisul/jawhar/blob/0c98757994e3a2cf4bf523d9fb2ed72ec0649549/readme.md#usage"
                  >Get started with your own blog!</a
                >
              </li>
            </ul>
          </details>
        </li>

        <div class="flex">
          <li
            (click)="goto('overview')"
            [ngClass]="[isDisabled('overview') ? 'hidden' : '']"
          >
            <a class="no-underline">{{
              $route() === 'overview' ? 'Overview/' : '/Overview'
            }}</a>
          </li>
          <li
            (click)="goto('posts')"
            [ngClass]="[isDisabled('posts') ? 'hidden' : '']"
          >
            <a class="no-underline">
              {{ $route() === 'posts' ? 'Posts/' : '/Posts' }}
            </a>
          </li>
          <li
            (click)="goto('tags')"
            [ngClass]="[isDisabled('tags') ? 'hidden' : '']"
          >
            <a class="no-underline">
              {{ $route() === 'tags' ? 'Tags/' : '/Tags' }}
            </a>
          </li>
        </div>
        <div class="flex">
          <li (click)="goto('')"><a>/Search</a></li>
        </div>
      </ul>
    </div>
    @if(uiService.$isLoading()){

    <progress class="progress w-full"></progress>
    }
  `,
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly uiService = inject(UiService);

  private readonly $userInView = toSignal(
    this.route.params.pipe(map((p) => p['username']))
  );

  readonly $route = signal('');

  constructor() {
    const _currRoute = window.location.pathname.split('/')[1];
    this.$route.set(_currRoute);
  }

  goto(route: string): void {
    if (route === '') {
      this.router.navigate(['/']);
    } else {
      if (!this.$userInView()) return;
      this.router.navigate([`/${route}/${this.$userInView()}`]);
    }
  }

  isDisabled(route: string): boolean {
    if (route === '') return false;
    return !this.$userInView();
  }
}
