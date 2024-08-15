import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouteService } from '../core/services/route.service';
import { PersonIconComponent } from './icons/person-icon.component';
import { PostsIconComponent } from './icons/posts-icon.component';
import { SearchIconComponent } from './icons/search-icon.component';
import { TagsIconComponent } from './icons/tags-icon.component';
import { Route } from './ui.model';
import { UiService } from './ui.service';

@Component({
  template: `
    <div class="btm-nav lg:max-w-2xl m-auto">
      <button
        (click)="routeService.goto('overview', $user())"
        [ngClass]="[
          routeService.isDisabled('overview', $user()) ? 'hidden' : ''
        ]"
        [ngClass]="[$route() === 'overview' ? 'active' : '']"
      >
        <app-person-icon></app-person-icon>
      </button>
      <button
        (click)="routeService.goto('posts', $user())"
        [ngClass]="[routeService.isDisabled('posts', $user()) ? 'hidden' : '']"
        [ngClass]="[$route() === 'posts' ? 'active' : '']"
      >
        <app-posts-icon></app-posts-icon>
      </button>
      <button
        (click)="routeService.goto('tags', $user())"
        [ngClass]="[routeService.isDisabled('tags', $user()) ? 'hidden' : '']"
        [ngClass]="[$route() === 'tags' ? 'active' : '']"
      >
        <app-tags-icon></app-tags-icon>
      </button>
      <button
        [ngClass]="[$route() === 'search' ? 'active' : '']"
        (click)="routeService.goto('', $user())"
      >
        <app-search-icon></app-search-icon>
      </button>
    </div>
  `,
  selector: 'app-bottomnav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    PersonIconComponent,
    PostsIconComponent,
    TagsIconComponent,
    SearchIconComponent,
  ],
})
export class BottomNavComponent {
  readonly uiService = inject(UiService);
  readonly routeService = inject(RouteService);

  $user = input.required<string>({ alias: 'user' });
  $route = input.required<Route>({ alias: 'route' });
}
