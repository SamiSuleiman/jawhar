import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list/:user',
        loadComponent: () =>
          import('./post-list.component').then((m) => m.PostListComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./post.component').then((m) => m.PostComponent),
      },
    ],
  },
];
