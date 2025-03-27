import type { Post } from "@prisma/client";

export type GetPostResult = {
  post: Post;
};

export type GetAllPostsResult = {
  posts: Post[];
};

export type CreatePostResult = {
  post: Post;
};

export type DeletePostResult = {
  success: boolean;
};

export enum PostError {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
}
