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
    path: 'tags/:username',
    canActivate: [isLoggedInGuard],
    component: TagListComponent,
  },
  {
    path: 'tags/:username/:tag',
    canActivate: [isLoggedInGuard],
    component: TagComponent,
  },
  {
    path: 'posts/:username',
    canActivate: [isLoggedInGuard],
    component: PostListComponent,
  },
  {
    path: 'posts/:username/:title',
    canActivate: [isLoggedInGuard],
    component: PostComponent,
  },
  {
    path: 'overview/:username',
    canActivate: [isLoggedInGuard],
    component: UserComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
