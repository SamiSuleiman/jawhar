import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService } from '../github/github.service';
import { NavbarComponent } from '../ui/navbar.component';
import { HistoryComponent } from './history.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  template: `
    <app-navbar> </app-navbar>
    <ng-container *transloco="let t">
      <div class="flex flex-col">
        <div class="p-1 mt-4 flex justify-start items-center">
          <div class="flex flex-col gap-2 w-full">
            <div class="flex flex-wrap sm:flex-nowrap">
              <label
                class="input input-bordered flex items-center gap-2 w-full rounded-none"
              >
                <input
                  [(ngModel)]="name"
                  type="text"
                  [placeholder]="t('inputs.placeholders.search')"
                />
              </label>
              @if ($isLoading()) {
                <button class="btn btn-square">
                  <span class="loading loading-spinner"></span>
                </button>
              } @else {
                <button class="btn rounded-none" (click)="onSubmit()">
                  {{ t('buttons.submit') }}
                </button>
              }
            </div>
          </div>
        </div>
        <app-history (chosen)="onHistoryNameChosen($event)"> </app-history>
      </div>
    </ng-container>
  `,
  styles: ``,
  selector: 'app-search',
  standalone: true,
  imports: [NavbarComponent, FormsModule, HistoryComponent, TranslocoDirective],
})
export class SearchComponent {
  private readonly router = inject(Router);
  protected readonly ghService = inject(GithubService);

  protected readonly $isLoading = signal(false);

  protected name = '';

  @HostListener('window:keydown.enter', ['$event'])
  protected async onSubmit() {
    this.$isLoading.set(true);
    const _res = await this.ghService.getProfile(this.name);
    this.$isLoading.set(false);

    if (_res) this.router.navigate([`/overview/${_res.username}`]);
  }

  protected onHistoryNameChosen(username: string) {
    this.name = username;
    this.onSubmit();
  }
}
