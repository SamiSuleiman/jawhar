import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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

    <div
      class="max-h-[60vh] overflow-y-scroll p-1 flex justify-start items-center"
    >
      <ul class="flex flex-col gap-2">
        @for (post of tagService.getTagPosts($tag()); track post) {
        <li class="hover:underline">
          <a [routerLink]="['/posts', post.title]">
            - <span>{{ post.title }}</span>
          </a>
        </li>
        }
      </ul>
    </div>
  `,
  styles: ``,
  selector: 'app-tags',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly tagService = inject(TagService);

  $tag = input.required<string>({ alias: 'tag' });
}
