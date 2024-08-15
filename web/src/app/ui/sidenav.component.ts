import { Component, inject, input } from '@angular/core';
import { RouteService } from '../core/services/route.service';
import { Route } from './ui.model';

@Component({
  template: `<div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col items-center justify-center">
      <!-- Page content here -->
      <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
        Open drawer
      </label>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer-2"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <!-- Sidebar content here -->
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>`,
  selector: 'app-sidenav',
  standalone: true,
})
export class SidenavComponent {
  readonly routeService = inject(RouteService);

  $user = input.required<string>({ alias: 'user' });
  $route = input.required<Route>({ alias: 'route' });
}
