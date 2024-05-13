import { Component, OnInit, computed, inject, input } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';
import { RouterLink } from '@angular/router';
import { PostService } from './post.service';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6 mb-4">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">/user</a></li>
          <li><a [routerLink]="['/posts']">/posts</a></li>
          <li><a>/tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/']">exit</a>
        </li>
      </div>
    </app-navbar>
    <div class="p-2">
      <h1 class="font-bold">{{ $post()?.title }}</h1>
      <div style="color:'inherit'" [innerHTML]="$post()?.content ?? ''"></div>
    </div>
  `,
  styles: ``,
  selector: 'app-post',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
})
export class PostComponent implements OnInit {
  private readonly postService = inject(PostService);

  $title = input.required<string>({ alias: 'title' });

  $post = computed(() => {
    const _post = this.postService.getPost(this.$title());
    return _post;
  });

  ngOnInit(): void {
    console.log(this.$post());
  }
}
