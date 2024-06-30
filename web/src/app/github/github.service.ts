import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Octokit } from 'octokit';
import { catchError, combineLatest, filter, firstValueFrom, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Profile, ProfileHistoryEntry } from './github.model';
import { UiService } from '../ui/ui.service';
import { GITHUB_BAD_CREDS, GITHUB_HISTORY_KEY } from './github.consts';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly uiService = inject(UiService);
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly $profiles = signal<Profile[]>([]);

  private octokit: any;

  async getProfile(
    username: string,
    refresh = false
  ): Promise<Profile | undefined> {
    this.octokit = new Octokit({
      auth: this.authService.getTokensFromLocalStorage()?.access,
    });

    const _profile = this.$profiles().find((p) => p.username === username);

    if (_profile && !refresh) {
      this.saveProfileToLocalStorage(_profile);
      return _profile;
    }

    this.uiService.$isLoading.set(true);
    const _fetchedProfile = await this.fetchProfile(username);

    if (!_profile && _fetchedProfile)
      this.$profiles.update((o) => [...o, _fetchedProfile as Profile]);

    if (_profile && refresh && _fetchedProfile)
      this.$profiles.update((o) =>
        o.map((p) =>
          p.username === username ? (_fetchedProfile as Profile) : p
        )
      );

    this.uiService.$isLoading.set(false);

    if (_fetchedProfile) this.saveProfileToLocalStorage(_fetchedProfile);

    return _fetchedProfile;
  }

  private saveProfileToLocalStorage(profile: Profile): void {
    const _profiles = JSON.parse(
      localStorage.getItem(GITHUB_HISTORY_KEY) ?? '[]'
    ) as ProfileHistoryEntry[];

    const _profile = _profiles.find((p) => p.username === profile.username);

    if (_profile) _profiles.splice(_profiles.indexOf(_profile), 1);

    _profiles.push({
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      timestamp: Date.now(),
    });

    localStorage.setItem(GITHUB_HISTORY_KEY, JSON.stringify(_profiles));
  }

  private async fetchProfile(username: string): Promise<Profile | undefined> {
    if (username.length === 0) return;

    try {
      const { data } = (await this.octokit.rest.users.getByUsername({
        username,
      })) as any | undefined;

      if (!data) return;

      const _files = await this.getGistFiles(username);

      if (!_files) return;

      return {
        username: data.login,
        displayName: data.name ?? data.login,
        avatarUrl: data.avatar_url,
        posts: _files,
      } as Profile;
    } catch (e: any) {
      if (e.message.includes(GITHUB_BAD_CREDS)) {
        this.authService.$shouldLogin.set(true);
        this.uiService.$alert.set({
          message: 'You are not logged in',
          type: 'error',
        });
      } else
        this.uiService.$alert.set({
          message: 'An error occurred. Please try again later.',
          type: 'error',
        });
      return;
    }
  }

  private async getGistFiles(username: string): Promise<string[] | undefined> {
    try {
      const { data } = await this.octokit.rest.gists.listForUser({
        username,
      });

      const gist = data?.find((g: any) => g.description === 'jawhar');
      const rawGistFileUrls: string[] = [];

      if (!gist?.files) return [];

      Object.values(gist?.files).forEach((file: any) => {
        if (file && file.raw_url && file.language === 'Markdown')
          rawGistFileUrls.push(file.raw_url);
      });

      return await firstValueFrom(
        combineLatest(
          rawGistFileUrls.map((url) =>
            this.http.get(url, { responseType: 'text' }).pipe(
              catchError(() => {
                this.uiService.$alert.set({
                  message: "Couldn't fetch the gist files.",
                  type: 'error',
                });
                return of(null);
              }),
              filter((file): file is string => !!file)
            )
          )
        ).pipe(filter((file) => !!file))
      );
    } catch (e: any) {
      this.uiService.$alert.set({
        message: 'An error occurred. Please try again later.',
        type: 'error',
      });

      if (e.message.includes(GITHUB_BAD_CREDS))
        this.authService.$shouldLogin.set(true);
      return;
    }
  }
}
