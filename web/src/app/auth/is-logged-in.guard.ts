import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

export const isLoggedInGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);

  const _isLoggedIn = !!_authService.getTokensFromLocalStorage();
  if (_isLoggedIn) {
    return of(true);
  } else {
    _authService.$shouldLogin.set(true);
    return of(false);
  }
};
