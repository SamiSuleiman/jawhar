import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Octokit } from 'octokit';

@Component({
  template: ` <router-outlet></router-outlet>`,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  name = '';

  async ngOnInit() {
    const octokit = new Octokit();

    const a = await octokit.rest.gists.listForUser({
      username: 'samisul',
    });

    console.log(a);
  }

  @HostListener('window:keydown.enter', ['$event'])
  onSubmit() {
    console.log(this.name);
  }
}
