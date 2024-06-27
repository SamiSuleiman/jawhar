import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginRequiredComponent } from './ui/login-required.component';
import { AuthService } from './auth/auth.service';

@Component({
  template: `
    <app-login-required
      ($login)="authService.logout()"
      [$isOpen]="authService.$shouldLogin()"
    ></app-login-required>
    <router-outlet></router-outlet>
  `,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginRequiredComponent],
})
export class AppComponent {
  readonly authService = inject(AuthService);
}
