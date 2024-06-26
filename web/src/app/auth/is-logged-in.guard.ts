import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  console.log('isLoggedInGuard', _authService);
  return of(true);
};
