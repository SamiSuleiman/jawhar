import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { isLoggedInGuard } from './auth/is-logged-in.guard';
import { PostListComponent } from './posts/post-list.component';
import { PostComponent } from './posts/post.component';
import { SearchComponent } from './search/search.component';
import { TagListComponent } from './tags/tag-list.component';
import { TagComponent } from './tags/tag.component';
import { UserComponent } from './user/user.component';

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
    redirectTo: '',
    children: [
      {
        path: ':username',
        component: TagListComponent,
        children: [
          {
            path: ':tag',
            component: TagComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'posts',
    canActivate: [isLoggedInGuard],
    redirectTo: '',
    children: [
      {
        path: ':username',
        component: PostListComponent,
        children: [
          {
            path: ':title',
            component: PostComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'overview',
    canActivate: [isLoggedInGuard],
    redirectTo: '',
    children: [
      {
        path: ':username',
        component: UserComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
