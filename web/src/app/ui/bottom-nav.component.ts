import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
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
import { RouteService } from '../core/services/route.service';

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
  readonly uiService = inject(UiService);
  readonly routeService = inject(RouteService);

  $user = input.required<string>({ alias: 'user' });
}
