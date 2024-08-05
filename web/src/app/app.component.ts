import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './ui/alert.component';

@Component({
  template: `
    <router-outlet></router-outlet>
    <div class="absolute bottom-0 left-0 w-full">
      <app-alert></app-alert>
    </div>
  `,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
})
export class AppComponent {}
