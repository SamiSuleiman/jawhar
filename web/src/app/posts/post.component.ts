import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../ui/navbar.component';
import { PostService } from './post.service';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6 mb-4">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">/user</a></li>
          <li><a [routerLink]="['/posts']">\\posts</a></li>
          <li><a [routerLink]="['/tags']">/tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/']">exit</a>
        </li>
      </div>
    </app-navbar>
    <div class="p-2 overflow-x-scroll">
      <h1 class="font-bold">{{ $post()?.title }}</h1>
      <div [innerHTML]="$post()?.content ?? ''"></div>
    </div>
  `,
  styles: ``,
  selector: 'app-post',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  readonly $username = input.required<string>({ alias: 'username' });
  readonly $title = input.required<string>({ alias: 'title' });

  private readonly postService = inject(PostService);

  $post = computed(() =>
    this.postService.getPost(this.$username(), this.$title())
  );
}
