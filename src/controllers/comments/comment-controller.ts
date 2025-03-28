import type { Prisma } from "@prisma/client";
import { prismaClient } from "../../extras/prisma.js";
import {
  CommentError,
  type CreateCommentResult,
  type GetAllCommentResult,
  type UpdateCommentResult,
  type DeleteCommentResult,
} from "../comments/comment-type.js";

// Create a comment on a post
export const createComment = async (p: {
  content: string;
  userId: string;
  postId: string;
}): Promise<CreateCommentResult> => {
  const comment = await prismaClient.comment.create({
    data: {
      userId: p.userId,
      postId: p.postId,
      content: p.content,
    },
  });

  return { comment };
};

// Get paginated comments in reverse chronological order

export const getAllComments = async (p: {
  postId: string;
  Limit: number;
  page?: number;
}): Promise<GetAllCommentResult> => {
  const page = p.page || 1;
  const Limit = p.Limit || 10;
  const offset = (page - 1) * Limit;

  const comment = await prismaClient.comment.findMany({
    where: {
      postId: p.postId,
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: Limit,
  });
  return { comment };
};

//Update a comment's text

export const updateComment = async (p: {
  userId: string;
  commentId: string;
  nextComment: string;
}): Promise<UpdateCommentResult> => {
  const comment = await prismaClient.comment.findUnique({
    where: {
      id: p.commentId,
    },
  });

  if (!comment) {
    throw CommentError.NOT_FOUND;
  }

  if (comment.userId !== p.userId) {
    throw CommentError.UNAUTHORIZED;
  }
  const updComment = await prismaClient.comment.update({
    where: {
      id: p.commentId,
    },
    data: { content: p.nextComment },
  });
  return { comment: updComment };
};

//Delete a comment

export const deleteComment = async (p: {
  userId: string;
  commentId: string;
}): Promise<DeleteCommentResult> => {
  const comment = await prismaClient.comment.findUnique({
    where: {
      id: p.commentId,
    },
  });

  if (!comment) {
    throw CommentError.NOT_FOUND;
  }

  if (comment.userId !== p.userId) {
    throw CommentError.UNAUTHORIZED;
  }

  const dComment = await prismaClient.comment.delete({
    where: {
      id: p.commentId,
    },
  });

  return { message: "Comment deleted successfully" };
};
