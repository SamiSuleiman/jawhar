import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Octokit } from 'octokit';
import {
  catchError,
  combineLatest,
  filter,
  firstValueFrom,
  of,
  tap,
} from 'rxjs';
import { Profile } from './github.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private octokit: any;
  readonly $gistFiles = signal<string[]>([]);
  readonly $profile = signal<Profile | undefined>(undefined);
  readonly $err = signal<boolean>(false);

  async init(username: string): Promise<boolean> {
    this.octokit = new Octokit({
      auth: this.authService.$tokens()?.access,
    });

    const _files = this.$gistFiles();
    const _profile = this.$profile();

    if (_files.length === 0) await this.getGistFiles(username);
    if (!_profile) await this.getProfile(username);

    if (this.$gistFiles() && this.$profile()) return true;
    return false;
  }

  async eject(): Promise<void> {
    this.$gistFiles.set([]);
    this.$profile.set(undefined);
  }

  private async getProfile(username: string): Promise<void> {
    try {
      this.$err.set(false);

      const { data } = (await this.octokit.rest.users.getByUsername({
        username,
      })) as any | undefined;

      if (!data) return;

      this.$profile.set({
        name: data.name ?? data.login,
        avatarUrl: data.avatar_url,
      } as Profile);
    } catch {
      this.$err.set(true);
    }
  }

  private async getGistFiles(username: string): Promise<void> {
    try {
      this.$err.set(false);
      const { data } = await this.octokit.rest.gists.listForUser({
        username,
      });

      const gist = data?.find((g: any) => g.description === 'jawhar');
      const rawGistFileUrls: string[] = [];

      Object.values(gist?.files).forEach((file: any) => {
        if (file && file.raw_url && file.language === 'Markdown')
          rawGistFileUrls.push(file.raw_url);
      });

      this.$err.set(false);
      await firstValueFrom(
        combineLatest(
          rawGistFileUrls.map((url) =>
            this.http.get(url, { responseType: 'text' }).pipe(
              catchError(() => {
                this.$err.set(true);
                return of(null);
              }),
              filter((file): file is string => !!file),
            ),
          ),
        ).pipe(
          filter((file) => !!file),
          tap((files) => this.$gistFiles.set(files)),
        ),
      );
    } catch {
      this.$err.set(true);
    }
  }
}
