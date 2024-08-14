import { Config } from '../../config/config.model';
import { Post } from '../../posts/post.model';

export interface ListRes<T> {
  list: T[];
  count: number;
}

export interface FilesRes {
  posts: ListRes<Post>;
  config: Config;
}
