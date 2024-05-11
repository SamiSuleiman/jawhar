import { Component } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';

@Component({
  template: `
    <app-navbar>
      <li><a>/posts</a></li>
      <li><a>/tags</a></li>
    </app-navbar>
  `,
  styles: ``,
  selector: 'app-post-list',
  standalone: true,
  imports: [NavbarComponent],
})
export class PostListComponent {}
