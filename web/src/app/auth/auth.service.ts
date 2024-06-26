import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { TokenRes } from './auth.model';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);
  readonly $tokens = signal<TokenRes | undefined>(undefined);

  // ! replace all the places were this is called with a isLoggedIn guard that verifies login only (tbd)
  // ! except in the auth component this can stay as is
  async login(): Promise<void> {
    const _tokensFromURL = this.getTokensFromURL();
    const _tokensFromLocalStorage = this.getTokensFromLocalStorage();

    if (_tokensFromLocalStorage) {
      const _refreshedTokens = await this.refreshToken();
      console.log(_refreshedTokens);
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

  isLoggedIn() {
    // * verify the token with the server
  }

  async refreshToken(): Promise<TokenRes | undefined> {
    const _tokens = this.getTokensFromLocalStorage();
    if (!_tokens) {
      this.logout();
      return;
    }

    return await firstValueFrom(
      this.httpClient.post<TokenRes>(
        `${environment.serverUrl}/auth/github/refresh`,
        _tokens
      )
    );
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
