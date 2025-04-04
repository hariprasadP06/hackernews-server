import { prismaClient } from "../../extras/prisma.js";
import {
  PostError,
  type GetPostResult,
  type GetAllPostsResult,
  type CreatePostResult,
  type DeletePostResult,
} from "./post-type.js";

// Get a single post by ID
export const getPost = async (p: {
  postId: string;
}): Promise<GetPostResult> => {
  const post = await prismaClient.post.findUnique({
    where: { id: p.postId },
  });

  if (!post) {
    throw PostError.NOT_FOUND;
  }

  return { post };
};

// Get all posts (limited to 10)
export const getAllPosts = async (): Promise<GetAllPostsResult> => {
  const posts = await prismaClient.post.findMany({
    take: 10, // Limit to 10 posts
    orderBy: { createdAt: "desc" }, // Get latest posts first
  });

  return { posts };
};

// Create a new post
export const createPost = async (p: {
  title: string;
  content: string;
  userId: string;
}): Promise<CreatePostResult> => {
  if (!p.title || !p.content || !p.userId) {
    throw PostError.BAD_REQUEST;
  }

  const post = await prismaClient.post.create({
    data: {
      title: p.title,
      content: p.content,
      userId: p.userId, // Assuming the post belongs to a user
    },
  });

  return { post };
};

// Delete a post by ID
export const deletePost = async (p: {
  postId: string;
}): Promise<DeletePostResult> => {
  const post = await prismaClient.post.findUnique({
    where: { id: p.postId },
  });

  if (!post) {
    throw PostError.NOT_FOUND;
  }

  await prismaClient.post.delete({
    where: { id: p.postId },
  });

  return { success: true };
};
