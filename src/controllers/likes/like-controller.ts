import { prismaClient } from "../../extras/prisma.js";
import {
  LikeError,
  type LikePostResult,
  type UnlikePostResult,
  type GetAllLikesResult,
} from "../likes/like-type.js";

// Like a post
export const likePost = async (p: {
  userId: string;
  postId: string;
}): Promise<LikePostResult> => {
  const existingLike = await prismaClient.like.findFirst({
    where: {
      userId: p.userId,
      postId: p.postId,
    },
  });

  if (existingLike) {
    throw LikeError.ALREADY_LIKED;
  }

  const like = await prismaClient.like.create({
    data: {
      userId: p.userId,
      postId: p.postId,
    },
  });

  return { like };
};

// Unlike a post
export const unlikePost = async (p: {
  userId: string;
  postId: string;
}): Promise<UnlikePostResult> => {
  const like = await prismaClient.like.findFirst({
    where: {
      userId: p.userId,
      postId: p.postId,
    },
  });

  if (!like) {
    throw LikeError.NOT_FOUND;
  }

  await prismaClient.like.delete({
    where: { id: like.id },
  });

  return { message: "Like removed successfully" };
};

// Get paginated likes in reverse chronological order
export const getAllLikes = async (p: {
  postId: string;
  page?: number;
  limit?: number;
}): Promise<GetAllLikesResult> => {
  const page = p.page || 1;
  const limit = p.limit || 10;
  const offset = (page - 1) * limit;

  const likes = await prismaClient.like.findMany({
    where: { postId: p.postId },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });

  return { likes };
};
