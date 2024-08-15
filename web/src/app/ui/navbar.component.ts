import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouteService } from '../core/services/route.service';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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
            (click)="routeService.goto('overview', $userInView())"
            [ngClass]="[
              routeService.isDisabled('overview', $userInView()) ? 'hidden' : ''
            ]"
          >
            <a class="no-underline">{{
              routeService.$route() === 'overview' ? 'Overview/' : '/Overview'
            }}</a>
          </li>
          <li
            (click)="routeService.goto('posts', $userInView())"
            [ngClass]="[
              routeService.isDisabled('posts', $userInView()) ? 'hidden' : ''
            ]"
          >
            <a class="no-underline">
              {{ routeService.$route() === 'posts' ? 'Posts/' : '/Posts' }}
            </a>
          </li>
          <li
            (click)="routeService.goto('tags', $userInView())"
            [ngClass]="[
              routeService.isDisabled('tags', $userInView()) ? 'hidden' : ''
            ]"
          >
            <a class="no-underline">
              {{ routeService.$route() === 'tags' ? 'Tags/' : '/Tags' }}
            </a>
          </li>
        </div>
        <div class="flex">
          <li (click)="routeService.goto('', $userInView())"><a>/Search</a></li>
        </div>
      </ul>
    </div>
    @if(routeService.$isLoading()){

    <progress class="progress w-full"></progress>
    }
  `,
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class NavbarComponent {
  private readonly route = inject(ActivatedRoute);
  readonly routeService = inject(RouteService);

  readonly $userInView = toSignal(
    this.route.params.pipe(map((p) => p['username']))
  );
}
