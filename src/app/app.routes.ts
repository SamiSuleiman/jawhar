import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.routes').then((m) => m.routes),
  },
];
