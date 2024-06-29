import { Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService } from '../github/github.service';
import { NavbarComponent } from '../ui/navbar.component';

@Component({
  template: `
    <app-navbar> </app-navbar>
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
          <button class="btn rounded-none" (click)="onSubmit()">submit</button>
          }
        </div>

        @if (ghService.$err()) {
        <div role="alert" class="alert alert-error rounded-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ ghService.$err() }}</span>
        </div>
        }
      </div>
    </div>
  `,
  styles: ``,
  selector: 'app-search',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
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
}
