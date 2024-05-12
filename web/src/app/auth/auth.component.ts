import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  template: ``,
  styles: ``,
  selector: 'app-auth',
  standalone: true,
  imports: [],
})
export class AuthComponent {
  private readonly authService = inject(AuthService);

  constructor() {
    this.authService.login();
  }
}
