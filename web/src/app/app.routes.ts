import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { PostListComponent } from './posts/post-list.component';
import { PostComponent } from './posts/post.component';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { TagListComponent } from './tags/tag-list.component';
import { TagComponent } from './tags/tag.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'tags',
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
