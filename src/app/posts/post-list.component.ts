import { Component } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6">
        <div class="flex items-center">
          <li><a [routerLink]="['/posts']">/ posts</a></li>
          <li><a>/ tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/']">exit</a>
        </li>
      </div>
    </app-navbar>
    posts list
  `,
  styles: ``,
  selector: 'app-post-list',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
})
export class PostListComponent {}
