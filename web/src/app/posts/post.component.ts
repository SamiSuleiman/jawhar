import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LayoutComponent } from '../ui/layout.component';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  template: `
    <app-layout> </app-layout>
    @if($post(); as post){
    <div class="p-2 overflow-x-scroll">
      <h1 class="font-bold">{{ post.title }}</h1>
      <img [src]="post.thumbnail" alt="Thumbnail" />
      <div [innerHTML]="post.content"></div>
    </div>
    }@else {
    <span
      class="loading loading-bars loading-lg absolute left-1/2 bottom-1/2"
    ></span>
    }
  `,
  selector: 'app-post',
  standalone: true,
  imports: [RouterLink, LayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  readonly $username = input.required<string>({ alias: 'username' });
  readonly $title = input.required<string>({ alias: 'title' });

  private readonly postService = inject(PostService);

  readonly $post = signal<Post | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    const _post = await this.postService.getPost(
      this.$username(),
      this.$title()
    );
    this.$post.set(_post);
  }
}
