import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GithubService } from './github/github.service';

@Component({
  template: ` <router-outlet></router-outlet>`,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly gh = inject(GithubService);

  name = '';

  async ngOnInit() {}
}
