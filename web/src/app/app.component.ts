import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './ui/alert.component';
import { LayoutComponent } from './ui/layout.component';

@Component({
  template: `
    <app-layout>
      <router-outlet></router-outlet>
    </app-layout>
    <div class="absolute bottom-0 left-0 w-full">
      <app-alert></app-alert>
    </div>
  `,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent, LayoutComponent],
})
export class AppComponent {}
