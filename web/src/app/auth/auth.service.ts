import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { TokenRes } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  readonly $tokens = signal<TokenRes | undefined>(undefined);

  login(): void {
    const _tokensFromURL = this.getTokensFromURL();
    const _tokensFromLocalStorage = this.getTokensFromLocalStorage();

    if (_tokensFromLocalStorage) {
      this.$tokens.set(_tokensFromLocalStorage);
      return;
    }

    if (_tokensFromURL) {
      localStorage.setItem('jawhar_tokens', JSON.stringify(_tokensFromURL));
      this.$tokens.set(_tokensFromURL);
      this.router.navigate(['/search']);
      return;
    }

    window.location.href = `${environment.serverUrl}/auth/github`;
  }

  logout() {
    localStorage.removeItem('jawhar_tokens');
    this.$tokens.set(undefined);
    this.router.navigate(['/']);
  }

  private getTokensFromLocalStorage(): TokenRes | null {
    const _tokens = localStorage.getItem('jawhar_tokens');
    return _tokens
      ? (JSON.parse(_tokens) as { access: string; refresh: string })
      : null;
  }

  private getTokensFromURL(): TokenRes | null {
    const _url = new URL(window.location.href);
    const _access = _url.searchParams.get('access');
    const _refresh = _url.searchParams.get('refresh');

    return _access && _refresh ? { access: _access, refresh: _refresh } : null;
  }
}
