import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Post } from '../posts/post.model';
import { PostService } from '../posts/post.service';
import { NavbarComponent } from '../ui/navbar.component';
import { TagService } from './tag.service';

@Component({
  template: `
    <app-navbar> </app-navbar>

    <div
      class="max-h-[60vh] overflow-y-scroll p-1 flex justify-start items-center"
    >
      <ul class="flex flex-col gap-2">
        @for (post of $posts(); track post) {
          <li class="hover:underline">
            <a (click)="goto(post.title)">
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
export class TagComponent implements OnInit {
  protected readonly $username = input.required<string>({ alias: 'username' });
  protected readonly $tag = input.required<string>({ alias: 'tag' });

  private readonly router = inject(Router);
  protected readonly tagService = inject(TagService);
  protected readonly postService = inject(PostService);

  protected readonly $posts = signal<Post[]>([]);

  async ngOnInit(): Promise<void> {
    const _posts = await this.postService.getParsedPosts(
      this.$username(),
      false,
      [this.$tag()],
    );

    this.$posts.set(_posts);
  }

  protected goto(title: string) {
    this.router.navigate([`/posts/${this.$username()}/${title}`]);
  }
}
