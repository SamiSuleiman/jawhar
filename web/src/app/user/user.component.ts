import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GithubService } from '../github/github.service';
import { NavbarComponent } from '../ui/navbar.component';
import { Profile } from '../github/github.model';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  template: `
    <app-navbar> </app-navbar>
    <ng-container *transloco="let t">
      <div>
        @if ($profile(); as profile) {
          <div class="flex flex-col items-center">
            <div class="avatar">
              <div class="w-32 rounded">
                <img [src]="profile.avatarUrl" />
              </div>
            </div>
            <p class="font-bold text-2xl">{{ profile.displayName }}</p>
            <p>{{ t('lists.pre.posts') }}{{ profile.posts.length }}</p>
          </div>
        }
      </div>
    </ng-container>
  `,
  selector: 'app-user',
  standalone: true,
  imports: [NavbarComponent, RouterLink, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  protected readonly $username = input.required<string>({ alias: 'username' });

  private readonly router = inject(Router);
  private readonly ghService = inject(GithubService);

  protected readonly $profile = signal<Profile | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    const _profile = await this.ghService.getProfile(this.$username());
    if (!_profile) this.router.navigate(['/']);
    this.$profile.set(_profile);
  }
}
