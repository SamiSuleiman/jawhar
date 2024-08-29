import { Component, inject, input } from '@angular/core';
import { GithubService } from '../github/github.service';

@Component({
  template: `
    <footer class="footer bg-neutral text-neutral-content p-10">
      <nav>
        <h6 class="footer-title">Link</h6>
        <a class="link link-hover">Advertisement</a>
      </nav>
    </footer>
  `,
  selector: 'app-footer',
  standalone: true,
})
export class FooterComponent {
  readonly githubService = inject(GithubService);

  $user = input.required<string>({ alias: 'user' });

  constructor() {
    this.githubService.getProfile();
  }
}
