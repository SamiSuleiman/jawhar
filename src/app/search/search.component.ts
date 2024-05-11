import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';
import { FormsModule } from '@angular/forms';

@Component({
  template: `
    <app-navbar> </app-navbar>

    <div class="p-1 h-[80vh] flex justify-center items-center">
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
      <button class="btn rounded-none" (click)="onSubmit()">submit</button>
    </div>
  `,
  styles: ``,
  selector: 'app-search',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
})
export class SearchComponent {
  name = '';

  @HostListener('window:keydown.enter', ['$event'])
  onSubmit() {
    // get user and gists, validate if they have valid blog gist, save them in search service signal
  }
}
