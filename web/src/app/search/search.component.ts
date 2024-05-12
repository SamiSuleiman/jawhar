import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../github/github.service';
import { Router } from '@angular/router';
import { container } from '../app.consts';

@Component({
  template: `
    <app-navbar> </app-navbar>
    <div class="p-1 mt-4 flex justify-start items-center">
      <label
        class="input input-bordered flex items-center gap-2 w-full rounded-none"
      >
        <input
          [(ngModel)]="name"
          type="text"
          class="grow"
          placeholder="search"
        />
      </label>
      @if ($isLoading()) {
        <button class="btn btn-square">
          <span class="loading loading-spinner"></span>
        </button>
      } @else {
        <button class="btn rounded-none" (click)="onSubmit()">submit</button>
      }
    </div>
  `,
  styles: ``,
  selector: 'app-search',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
})
export class SearchComponent implements OnInit {
  private readonly ghService = inject(GithubService);
  private readonly router = inject(Router);

  readonly $isLoading = signal(false);

  name = '';

  async ngOnInit(): Promise<void> {
    await this.ghService.eject();
  }

  @HostListener('window:keydown.enter', ['$event'])
  async onSubmit() {
    this.$isLoading.set(true);
    const _res = await this.ghService.init(this.name);
    this.$isLoading.set(false);

    if (_res) this.router.navigate(['user']);
  }
}
