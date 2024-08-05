import { Post } from '../posts/post.model';

export interface Profile {
  username: string;
  displayName: string;
  avatarUrl: string;
  posts: Post[];
}

export interface ProfileHistoryEntry {
  username: string;
  avatarUrl: string;
  timestamp: number;
}

export interface ProfileDto {
  displayName: string;
  avatarUrl: string;
}
