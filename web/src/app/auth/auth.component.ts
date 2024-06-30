import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  template: ``,
  selector: 'app-auth',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    console.log('AuthComponent: ngOnInit()');
    this.authService.login();
    this.router.navigate(['/search']);
  }
}
