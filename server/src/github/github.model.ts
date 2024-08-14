import { Config } from 'src/config/config.model';
import { ListResDto } from 'src/core/models/res.model';

export interface ProfileDto {
  displayName: string;
  avatarUrl: string;
}

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

export interface FilesResDto {
  posts: ListResDto<Post>;
  config: Config;
}
