import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  template: ` <p>tags works!</p> `,
  styles: ``,
  selector: 'app-tags',
  standalone: true,
  imports: [],
})
export class TagComponent implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.login();
  }
}
