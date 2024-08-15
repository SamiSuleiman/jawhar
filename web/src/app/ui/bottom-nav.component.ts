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
import { PersonIconComponent } from './icons/person-icon.component';
import { PostsIconComponent } from './icons/posts-icon.component';
import { TagsIconComponent } from './icons/tags-icon.component';
import { SearchIconComponent } from './icons/search-icon.component';

@Component({
  template: `
    <div class="btm-nav">
      <button>
        <app-person-icon></app-person-icon>
      </button>
      <button class="active">
        <app-posts-icon></app-posts-icon>
      </button>
      <button>
        <app-tags-icon></app-tags-icon>
      </button>
      <button>
        <app-search-icon></app-search-icon>
      </button>
    </div>
    @if(uiService.$isLoading()){
    <progress class="progress w-full"></progress>
    }
  `,
  selector: 'app-bottom-nav',
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
