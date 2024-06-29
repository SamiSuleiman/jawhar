import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginRequiredComponent } from './ui/login-required.component';
import { AuthService } from './auth/auth.service';
import { AlertComponent } from './ui/alert.component';

@Component({
  template: `
    <app-login-required
      ($login)="authService.logout()"
      [$isOpen]="authService.$shouldLogin()"
    ></app-login-required>
    <router-outlet></router-outlet>
    <div class="absolute bottom-0 left-0 w-full">
      <app-alert></app-alert>
    </div>
  `,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginRequiredComponent, AlertComponent],
})
export class AppComponent {
  readonly authService = inject(AuthService);
}
