import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `
    <div class="navbar bg-base-100">
      <ul class="menu menu-horizontal px-1">
        <ng-content></ng-content>
      </ul>
    </div>
  `,
  styles: ``,
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {}
