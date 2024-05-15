import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavbarComponent } from '../ui/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <app-navbar>
      <div class="flex items-center lg:gap-6 mb-4">
        <div class="flex items-center">
          <li><a [routerLink]="['/user']">/user</a></li>
          <li><a [routerLink]="['/posts']">/posts</a></li>
          <li><a [routerLink]="['/tags']">\\tags</a></li>
        </div>
        <li class="underline decoration-wavy font-bold">
          <a [routerLink]="['/search']">exit</a>
        </li>
      </div>
    </app-navbar>

    <div
      class="max-h-[60vh] overflow-y-scroll p-1 flex justify-start items-center"
    ></div>
  `,
  styles: ``,
  selector: 'app-tags',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.login();
  }
}
