import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { Config } from '../config/config.model';
import { GithubService } from '../github/github.service';
import { BottomNavComponent } from './bottom-nav.component';
import { NavbarComponent } from './navbar.component';
import { Route } from './ui.model';
import { UiService } from './ui.service';

@Component({
  template: `
    @if (uiService.$isLoading()) {
      <span
        class="loading loading-bars loading-lg absolute left-1/2 bottom-1/2"
      ></span>
    }
    @switch ($userConfig()?.theme) {
      @case ('bottom') {
        <app-bottomnav
          [user]="$userInView()"
          [route]="$route()"
        ></app-bottomnav>
      }
      @case ('top') {
        <app-navbar [user]="$userInView()" [route]="$route()"></app-navbar>
      }
      @case (undefined && uiService.$isLoading()) {
        @if (uiService.$isLoading()) {
          <div class="skeleton h-4 w-full"></div>
        } @else {
          <app-navbar [user]="$userInView()" [route]="$route()"></app-navbar>
        }
      }
    }
    <ng-content></ng-content>
  `,
  imports: [NavbarComponent, BottomNavComponent],
  selector: 'app-layout',
  standalone: true,
})
export class LayoutComponent {
  private readonly route = inject(ActivatedRoute);
  readonly uiService = inject(UiService);
  readonly githubService = inject(GithubService);

  readonly $userConfig = signal<Config | undefined>(undefined);
  readonly $route = signal<Route>('search');

  readonly $userInView = toSignal(
    this.route.params.pipe(
      map((p) => p['username']),
      filter((u) => !!u),
      tap(async (user) => {
        this.$userConfig.set(
          (await this.githubService.getProfile(user))?.config,
        );

        this.$route.set(this.getRoute(this.route.snapshot.routeConfig?.path));
      }),
    ),
  );

  private getRoute(routeConfigPath: string | undefined): Route {
    if (routeConfigPath?.includes('posts') || routeConfigPath?.includes('post'))
      return 'posts';

    if (routeConfigPath?.includes('tags') || routeConfigPath?.includes('tag'))
      return 'tags';

    if (routeConfigPath?.includes('overview')) return 'overview';

    return 'search';
  }
}
