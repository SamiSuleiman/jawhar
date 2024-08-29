import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService } from '../github/github.service';
import { LayoutComponent } from '../ui/layout.component';
import { HistoryComponent } from './history.component';
import { NgClass } from '@angular/common';
import { UiService } from '../ui/ui.service';

@Component({
  template: `
    <div class="flex flex-col">
      <div class="p-1 mt-4 flex justify-start items-center">
        <div class="flex flex-col gap-2 w-full">
          <div class="flex flex-wrap sm:flex-nowrap">
            <label
              class="input input-bordered flex items-center gap-2 w-full rounded-none"
            >
              <input [(ngModel)]="name" type="text" placeholder="search" />
            </label>
            <button
              class="btn rounded-none"
              (click)="onSubmit()"
              [ngClass]="[
                uiService.$isLoading() ? 'disabled cursor-not-allowed' : '',
              ]"
            >
              submit
            </button>
          </div>
        </div>
      </div>
      <app-history (chosen)="onHistoryNameChosen($event)"></app-history>
    </div>
  `,
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, HistoryComponent, LayoutComponent, NgClass],
})
export class SearchComponent {
  private readonly router = inject(Router);
  readonly uiService = inject(UiService);
  readonly ghService = inject(GithubService);

  name = '';

  @HostListener('window:keydown.enter', ['$event'])
  async onSubmit() {
    this.uiService.$isLoading.set(true);
    const _res = await this.ghService.getProfile(this.name);
    this.uiService.$isLoading.set(false);

    if (_res) this.router.navigate([`/overview/${_res.username}`]);
  }

  onHistoryNameChosen(username: string) {
    this.name = username;
    this.onSubmit();
  }
}
