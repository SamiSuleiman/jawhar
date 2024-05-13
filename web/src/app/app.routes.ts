import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { PostListComponent } from './posts/post-list.component';
import { PostComponent } from './posts/post.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [authGuard],
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [authGuard],
  },
  {
    path: 'posts',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: PostListComponent,
      },
      {
        path: ':title',
        component: PostComponent,
      },
    ],
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: '**',
    redirectTo: 'search',
  },
];
