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

@Component({
  template: `
    <div class="navbar bg-base-100">
      <ul class="menu menu-horizontal px-1 flex w-full justify-between">
        <div class="flex">
          <li
            (click)="goto('overview')"
            [ngClass]="[isDisabled('overview') ? 'hidden' : '']"
          >
            <a>{{ $route() === 'overview' ? 'Overview/' : '/Overview' }}</a>
          </li>
          <li
            (click)="goto('posts')"
            [ngClass]="[isDisabled('posts') ? 'hidden' : '']"
          >
            <a>
              {{ $route() === 'posts' ? 'Posts/' : '/Posts' }}
            </a>
          </li>
          <li
            (click)="goto('tags')"
            [ngClass]="[isDisabled('tags') ? 'hidden' : '']"
          >
            <a>
              {{ $route() === 'tags' ? 'Tags/' : '/Tags' }}
            </a>
          </li>
        </div>
        <div class="flex">
          <li (click)="goto('')"><a>/Search</a></li>
        </div>
      </ul>
    </div>
  `,
  styles: ``,
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
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
