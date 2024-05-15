import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { TagService } from './tag.service';
import { GithubService } from '../github/github.service';
import { AuthService } from '../auth/auth.service';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6 mb-4">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">/user</a></li>
          <li><a [routerLink]="['/posts']">/posts</a></li>
          <li><a [routerLink]="['/tags']">/tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/search']">exit</a>
        </li>
      </div>
    </app-navbar>

    <div
      class="max-h-[60vh] overflow-y-scroll p-1 flex justify-start items-center"
    >
      <ul class="flex flex-col gap-2">
        @for (tag of tagService.$tags(); track tag) {
          <li class="hover:underline">
            <a [routerLink]="['/tags', tag]">
              - <span>{{ tag }}</span>
            </a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: ``,
  selector: 'app-tag-list',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
})
export class TagListComponent implements OnInit {
  private readonly ghService = inject(GithubService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  readonly tagService = inject(TagService);

  ngOnInit(): void {
    this.authService.login();
    if (!this.ghService.$profile()) this.router.navigate(['search']);
  }
}
