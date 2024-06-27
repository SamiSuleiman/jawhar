import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, interval, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenRes } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);
  private readonly $isRefreshing = signal(false);
  readonly $shouldLogin = signal(false);
  readonly $tokens = signal<TokenRes | undefined>(undefined);

  constructor() {
    interval(1000 * 60 * 5)
      .pipe(
        switchMap(async () => this.refreshToken()),
        tap((tokens) => {
          if (!tokens) this.logout();
          else this.$tokens.set(tokens);
        })
      )
      .subscribe();
  }

  async login(): Promise<void> {
    const _tokensFromURL = this.getTokensFromURL();
    const _tokensFromLocalStorage = this.getTokensFromLocalStorage();

    if (_tokensFromLocalStorage) {
      const _refreshedTokens = await this.refreshToken();

      if (!_refreshedTokens) this.logout();
      else {
        this.$tokens.set(_refreshedTokens);
        this.router.navigate(['/']);
      }

      return;
    }

    if (_tokensFromURL) {
      localStorage.setItem('jawhar_tokens', JSON.stringify(_tokensFromURL));
      this.$tokens.set(_tokensFromURL);
      this.router.navigate(['/']);
      return;
    }

    this.logout();
  }

  logout(): void {
    localStorage.removeItem('jawhar_tokens');
    this.$tokens.set(undefined);
    this.redirectToLogin();
  }

  async refreshToken(): Promise<TokenRes | undefined> {
    if (this.$isRefreshing()) return;
    this.$isRefreshing.set(true);
    const _tokens = this.getTokensFromLocalStorage();
    if (!_tokens) {
      this.$isRefreshing.set(false);
      this.logout();
      return;
    }

    return await firstValueFrom(
      this.httpClient
        .post<TokenRes>(`${environment.serverUrl}/auth/github/refresh`, _tokens)
        .pipe(
          catchError(() => of(undefined)),
          tap(() => this.$isRefreshing.set(false))
        )
    );
  }

  getTokensFromLocalStorage(): TokenRes | null {
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

  private redirectToLogin() {
    window.location.href = `${environment.serverUrl}/auth/github`;
  }
}
