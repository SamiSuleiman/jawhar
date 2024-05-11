import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { PostListComponent } from './posts/post-list.component';
import { PostComponent } from './posts/post.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'posts',
    children: [
      {
        path: '',
        component: PostListComponent,
      },
      {
        path: ':id',
        component: PostComponent,
      },
    ],
  },
  {
    path: 'users/:id',
    component: UserComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
