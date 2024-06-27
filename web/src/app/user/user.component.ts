import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GithubService } from '../github/github.service';
import { NavbarComponent } from '../ui/navbar.component';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6 mb-4">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">\\user</a></li>
          <li><a [routerLink]="['/posts']">/posts</a></li>
          <li><a [routerLink]="['/tags']">/tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/search']">exit</a>
        </li>
      </div>
    </app-navbar>
    <div>
      @if (ghService.$profile(); as profile) {
      <div class="flex flex-col items-center">
        <div class="avatar">
          <div class="w-32 rounded">
            <img [src]="profile.avatarUrl" />
          </div>
        </div>
        <p class="font-bold text-2xl">{{ profile.name }}</p>
        <p>posts: {{ ghService.$gistFiles().length }}</p>
      </div>
      } @else {
      <p>no profile.</p>
      }
    </div>
  `,
  styles: ``,
  selector: 'app-user',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  private readonly router = inject(Router);
  readonly ghService = inject(GithubService);

  ngOnInit(): void {
    if (!this.ghService.$profile()) this.router.navigate(['search']);
  }
}
