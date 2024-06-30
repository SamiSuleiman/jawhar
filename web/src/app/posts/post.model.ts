export interface Post {
  title: string;
  content: string;
  tags: string[];
  thumbnail?: string;
}

export interface PostMetadata {
  title: string;
  tags: string[];
  thumbnail?: string;
  draft: boolean;
  contentUrl: string;
  content: string;
}
