import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../ui/navbar.component';
import { PostService } from './post.service';
import { Post } from './post.model';

@Component({
  template: `
    <app-navbar> </app-navbar>
    <div class="p-2 overflow-x-scroll">
      <h1 class="font-bold">{{ $post()?.title }}</h1>
      <div [innerHTML]="$post()?.content ?? ''"></div>
    </div>
  `,
  selector: 'app-post',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
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
