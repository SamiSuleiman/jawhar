export interface Profile {
  username: string;
  displayName: string;
  avatarUrl: string;
  posts: string[];
}

export interface ProfileHistoryEntry {
  username: string;
  avatarUrl: string;
  timestamp: number;
}
