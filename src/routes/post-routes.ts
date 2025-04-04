import { Hono } from "hono";
import {
  getPost,
  getAllPosts,
  createPost,
  deletePost,
} from "../controllers/posts/post-controller.js";
import { PostError } from "../controllers/posts/post-type.js";
import { tokenMiddleware } from "./middelwares/token-middelware.js";

export const postsRoutes = new Hono();

// Get a single post by ID
postsRoutes.get("/:postId", tokenMiddleware, async (context) => {
  const postId = context.req.param("postId");

  try {
    const post = await getPost({ postId });

    return context.json(
      {
        data: post,
      },
      200
    );
  } catch (e) {
    if (e === PostError.NOT_FOUND) {
      return context.json(
        {
          error: "Post not found",
        },
        404
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// Get all posts (limit 10)
postsRoutes.get("", tokenMiddleware, async (context) => {
  try {
    const posts = await getAllPosts();

    return context.json(
      {
        data: posts,
      },
      200
    );
  } catch (e) {
    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// Create a new post
postsRoutes.post("", tokenMiddleware, async (context) => {
  const { title, content, userId } = await context.req.json();

  try {
    const newPost = await createPost({ title, content, userId });

    return context.json(
      {
        data: newPost,
      },
      201
    );
  } catch (e) {
    if (e === PostError.BAD_REQUEST) {
      return context.json(
        {
          error: "Invalid post data",
        },
        400
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// Delete a post by ID
postsRoutes.delete("/:postId", tokenMiddleware, async (context) => {
  const postId = context.req.param("postId");

  try {
    const deleteResult = await deletePost({ postId });

    return context.json(
      {
        data: deleteResult,
      },
      200
    );
  } catch (e) {
    if (e === PostError.NOT_FOUND) {
      return context.json(
        {
          error: "Post not found",
        },
        404
      );
    }

    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});
