import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Octokit } from 'octokit';
import { NavbarComponent } from './ui/navbar.component';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  template: ` <app-navbar>
      <button class="btn btn-ghost">search</button>
    </app-navbar>
    <router-outlet></router-outlet>`,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FormsModule],
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
