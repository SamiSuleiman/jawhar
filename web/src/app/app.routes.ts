import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { PostListComponent } from './posts/post-list.component';
import { PostComponent } from './posts/post.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { TagListComponent } from './tags/tag-list.component';
import { TagComponent } from './tags/tag.component';
import { isLoggedInGuard } from './auth/is-logged-in.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
  },
  {
    path: '',
    component: SearchComponent,
    canActivate: [isLoggedInGuard],
  },
  {
    path: 'tags',
    canActivate: [isLoggedInGuard],
    children: [
      {
        path: '',
        component: TagListComponent,
      },
      {
        path: ':tag',
        component: TagComponent,
      },
    ],
  },
  {
    path: 'posts',
    canActivate: [isLoggedInGuard],
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
    canActivate: [isLoggedInGuard],
    component: UserComponent,
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
