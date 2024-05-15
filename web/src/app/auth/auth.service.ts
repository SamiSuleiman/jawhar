import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  readonly $tokens = signal<{ access: string; refresh: string } | undefined>(
    undefined,
  );

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

  private getTokensFromLocalStorage(): {
    access: string;
    refresh: string;
  } | null {
    const _tokens = localStorage.getItem('jawhar_tokens');
    if (_tokens) {
      return JSON.parse(_tokens) as { access: string; refresh: string };
    }

    return null;
  }

  private getTokensFromURL(): { access: string; refresh: string } | null {
    const _url = new URL(window.location.href);
    const _access = _url.searchParams.get('access');
    const _refresh = _url.searchParams.get('refresh');

    if (_access && _refresh) {
      return { access: _access, refresh: _refresh };
    }

    return null;
  }
}
