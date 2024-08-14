import { Config } from '../config/config.model';
import { Post } from '../posts/post.model';

export interface Profile {
  username: string;
  displayName: string;
  avatarUrl: string;
  posts: Post[];
  config: Config;
}

export interface ProfileHistoryEntry {
  username: string;
  avatarUrl: string;
  timestamp: number;
}

export interface ProfileRes {
  displayName: string;
  avatarUrl: string;
}
