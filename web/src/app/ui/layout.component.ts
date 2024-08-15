import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { Config } from '../config/config.model';
import { GithubService } from '../github/github.service';
import { BottomNavComponent } from './bottom-nav.component';
import { NavbarComponent } from './navbar.component';
import { SidenavComponent } from './sidenav.component';
import { UiService } from './ui.service';

@Component({
  template: `
    @if(uiService.$isLoading()){
    <span
      class="loading loading-bars loading-lg absolute left-1/2 bottom-1/2"
    ></span>
    } @switch ($userConfig()?.theme) { @case ('bottom'){
    <app-bottom-nav [user]="$userInView()"></app-bottom-nav>
    } @case('top'){
    <app-navbar [user]="$userInView()"></app-navbar>
    }@case('side'){
    <app-sidenav [user]="$userInView()"></app-sidenav>
    } }
    <ng-content></ng-content>
  `,
  imports: [NavbarComponent, BottomNavComponent, SidenavComponent],
  selector: 'app-layout',
  standalone: true,
})
export class LayoutComponent {
  private readonly route = inject(ActivatedRoute);
  readonly uiService = inject(UiService);
  readonly githubService = inject(GithubService);

  readonly $userConfig = signal<Config | undefined>(undefined);

  readonly $userInView = toSignal(
    this.route.params.pipe(
      map((p) => p['username']),
      filter((u) => !!u),
      tap(async (user) =>
        this.$userConfig.set(
          (await this.githubService.getProfile(user))?.config
        )
      )
    )
  );
}
