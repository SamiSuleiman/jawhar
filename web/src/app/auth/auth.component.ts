import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  template: ``,
  styles: ``,
  selector: 'app-auth',
  standalone: true,
  imports: [],
})
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    const _is = this.authService.login();
    if (_is) this.router.navigate(['/search']);
  }
}
