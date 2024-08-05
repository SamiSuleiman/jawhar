import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list.component';
import { PostComponent } from './posts/post.component';
import { SearchComponent } from './search/search.component';
import { TagListComponent } from './tags/tag-list.component';
import { TagComponent } from './tags/tag.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'tags/:username',
    component: TagListComponent,
  },
  {
    path: 'tags/:username/:tag',
    component: TagComponent,
  },
  {
    path: 'posts/:username',
    component: PostListComponent,
  },
  {
    path: 'posts/:username/:title',
    component: PostComponent,
  },
  {
    path: 'overview/:username',
    component: UserComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
