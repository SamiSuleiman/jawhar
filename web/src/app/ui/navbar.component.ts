import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouteService } from '../core/services/route.service';
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
            (click)="routeService.goto('overview', $user())"
            [ngClass]="[
              routeService.isDisabled('overview', $user()) ? 'hidden' : ''
            ]"
          >
            <a class="no-underline">Overview</a>
          </li>
          <li
            (click)="routeService.goto('posts', $user())"
            [ngClass]="[
              routeService.isDisabled('posts', $user()) ? 'hidden' : ''
            ]"
          >
            <a class="no-underline"> Posts </a>
          </li>
          <li
            (click)="routeService.goto('tags', $user())"
            [ngClass]="[
              routeService.isDisabled('tags', $user()) ? 'hidden' : ''
            ]"
          >
            <a class="no-underline"> Tags </a>
          </li>
        </div>
        <div class="flex">
          <li (click)="routeService.goto('', $user())"><a>/Search</a></li>
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
  readonly uiService = inject(UiService);
  readonly routeService = inject(RouteService);

  $user = input.required<string>({ alias: 'user' });
}
