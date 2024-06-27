import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

export const isLoggedInGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);

  const _isLoggedIn = _authService.isLoggedIn();
  if (_isLoggedIn) {
    return of(true);
  } else {
    _authService.$shouldLogin.set(true);
    return of(false);
  }
};
