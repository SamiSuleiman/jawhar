import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

export const isLoggedInGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);
  return _authService.isLoggedIn();
};
