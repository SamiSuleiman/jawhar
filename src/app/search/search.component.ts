import { Component } from '@angular/core';
import { NavbarComponent } from '../ui/navbar.component';

@Component({
  template: ` <app-navbar> </app-navbar> `,
  styles: ``,
  selector: 'app-search',
  standalone: true,
  imports: [NavbarComponent],
})
export class SearchComponent {}
