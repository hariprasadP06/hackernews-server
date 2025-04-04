import { Hono } from "hono";
import {
  createComment,
  getAllComments,
  deleteComment,
  updateComment,
} from "../controllers/comments/comment-controller.js";
import { tokenMiddleware } from "./middelwares/token-middelware.js";
import { CommentError } from "../controllers/comments/comment-type.js";

export const commentsRoutes = new Hono();

//Get all comments on a post (paginated, reverse order)
commentsRoutes.get("/on/:postId", async (context) => {
  const postId = context.req.param("postId");
  const page = parseInt(context.req.query("page") || "1");
  const Limit = parseInt(context.req.query("Limit") || "10");

  try {
    const comments = await getAllComments({ postId, page, Limit });

    return context.json(
      {
        data: comments,
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

// Create a comment on a post
commentsRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = context.req.param("postId");
  const { content } = await context.req.json();

  try {
    const comment = await createComment({ userId, postId, content });

    return context.json(
      {
        data: comment,
      },
      201
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

// Update a comment
commentsRoutes.patch("/:commentId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const commentId = context.req.param("commentId");
  const { nextComment } = await context.req.json();

  try {
    const updatedComment = await updateComment({
      userId,
      commentId,
      nextComment,
    });

    return context.json(
      {
        data: updatedComment,
      },
      200
    );
  } catch (e) {
    if (e === CommentError.NOT_FOUND) {
      return context.json(
        {
          error: "Comment not found",
        },
        404
      );
    }

    if (e === CommentError.UNAUTHORIZED) {
      return context.json(
        {
          error: "Unauthorized to update this comment",
        },
        403
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

// Delete a comment
commentsRoutes.delete("/:commentId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const commentId = context.req.param("commentId");

  try {
    const result = await deleteComment({ userId, commentId });

    return context.json(
      {
        message: result.message,
      },
      200
    );
  } catch (e) {
    if (e === CommentError.NOT_FOUND) {
      return context.json(
        {
          error: "Comment not found",
        },
        404
      );
    }

    if (e === CommentError.UNAUTHORIZED) {
      return context.json(
        {
          error: "Unauthorized to delete this comment",
        },
        403
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
