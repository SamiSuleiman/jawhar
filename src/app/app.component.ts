import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  template: ` <router-outlet></router-outlet>`,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  async ngOnInit() {}
}
