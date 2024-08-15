import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { NavbarComponent } from './navbar.component';

@Component({
  template: `
    <app-navbar [user]="$userInView()"></app-navbar>
    <ng-content></ng-content>
  `,
  imports: [NavbarComponent],
  selector: 'app-layout',
  standalone: true,
})
export class LayoutComponent {
  private readonly route = inject(ActivatedRoute);

  readonly $userInView = toSignal(
    this.route.params.pipe(map((p) => p['username']))
  );
}
