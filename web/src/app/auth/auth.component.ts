import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  template: ``,
  selector: 'app-auth',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    console.log('AuthComponent: ngOnInit()');
    this.authService.login();
  }
}
