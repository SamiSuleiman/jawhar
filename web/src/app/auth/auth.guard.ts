import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);

  const _isLoggedIn = _authService.login();

  if (_isLoggedIn) return true;

  window.location.href = `${environment.serverUrl}/auth/github`;

  return false;
};
