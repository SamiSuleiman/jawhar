import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import {
  catchError,
  combineLatest,
  filter,
  firstValueFrom,
  map,
  of,
} from 'rxjs';
import { Profile, ProfileDto, ProfileHistoryEntry } from './github.model';
import { UiService } from '../ui/ui.service';
import { GITHUB_HISTORY_KEY } from './github.consts';
import { environment } from '../../environments/environment';
import { ListResDto } from '../core/dtos/res.dto';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly uiService = inject(UiService);
  private readonly http = inject(HttpClient);
  private readonly $profiles = signal<Profile[]>([]);

  private readonly githubGistBaseUrl = 'https://gist.github.com';

  async getProfile(
    username: string,
    refresh = false
  ): Promise<Profile | undefined> {
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

    const data = await firstValueFrom(
      this.http.get<ProfileDto | undefined>(
        `${environment.serverUrl}/github/profile/${username}`
      )
    );

    if (!data) return;

    const _files = await this.fetchGistFiles(username);

    if (!_files) return;

    return {
      username: username,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      posts: _files,
    } as Profile;
  }

  private async fetchGistFiles(username: string): Promise<string[]> {
    return await firstValueFrom(
      this.http
        .get<ListResDto<string>>(
          `${environment.serverUrl}/github/posts/${username}`
        )
        .pipe(map((data) => data.list))
    );
  }
}
