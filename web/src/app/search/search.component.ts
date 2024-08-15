import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService } from '../github/github.service';
import { LayoutComponent } from '../ui/layout.component';
import { HistoryComponent } from './history.component';

@Component({
  template: `
    <app-layout> </app-layout>
    <div class="flex flex-col">
      <div class="p-1 mt-4 flex justify-start items-center">
        <div class="flex flex-col gap-2 w-full">
          <div class="flex flex-wrap sm:flex-nowrap">
            <label
              class="input input-bordered flex items-center gap-2 w-full rounded-none"
            >
              <input [(ngModel)]="name" type="text" placeholder="search" />
            </label>
            @if ($isLoading()) {
            <button class="btn btn-square">
              <span class="loading loading-spinner"></span>
            </button>
            } @else {
            <button class="btn rounded-none" (click)="onSubmit()">
              submit
            </button>
            }
          </div>
        </div>
      </div>
      <app-history (chosen)="onHistoryNameChosen($event)"> </app-history>
    </div>
  `,
  styles: ``,
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, HistoryComponent, LayoutComponent],
})
export class SearchComponent {
  private readonly router = inject(Router);
  readonly ghService = inject(GithubService);

  readonly $isLoading = signal(false);

  name = '';

  @HostListener('window:keydown.enter', ['$event'])
  async onSubmit() {
    this.$isLoading.set(true);
    const _res = await this.ghService.getProfile(this.name);
    this.$isLoading.set(false);

    if (_res) this.router.navigate([`/overview/${_res.username}`]);
  }

  onHistoryNameChosen(username: string) {
    this.name = username;
    this.onSubmit();
  }
}
