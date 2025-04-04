import type { Comment } from "@prisma/client";

export type GetAllCommentResult = {
  comment: Comment[];
};

export type CreateCommentResult = {
  comment: Comment;
};

export type UpdateCommentResult = {
  comment: Comment;
};

export type DeleteCommentResult = {
  message: string;
};

export enum CommentError {
  NOT_FOUND,
  UNAUTHORIZED,
}
