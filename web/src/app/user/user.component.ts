import { Component, OnInit, inject } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { GithubService } from '../github/github.service';
import { container } from '../app.consts';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6">
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
    <div [class]="container">
      @if (ghService.$profile(); as profile) {
        <div class="flex flex-col items-center">
          <div class="avatar">
            <div class="w-24 rounded">
              <img [src]="profile.avatarUrl" />
            </div>
          </div>
          <h1>{{ profile.name }}</h1>
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
})
export class UserComponent implements OnInit {
  private readonly router = inject(Router);
  readonly ghService = inject(GithubService);

  readonly container = container;

  ngOnInit(): void {
    if (!this.ghService.$profile()) this.router.navigate(['search']);
  }
}
