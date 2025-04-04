import { Hono } from "hono";
import {
  likePost,
  unlikePost,
  getAllLikes,
} from "../controllers/likes/like-controller.js";
import { LikeError } from "../controllers/likes/like-type.js";
import { tokenMiddleware } from "./middelwares/token-middelware.js";

export const likesRoutes = new Hono();

//  Get all likes on a post (paginated, reverse order)
likesRoutes.get("/on/:postId", async (context) => {
  const postId = context.req.param("postId");
  const page = parseInt(context.req.query("page") || "1");
  const limit = parseInt(context.req.query("limit") || "10");

  try {
    const likes = await getAllLikes({ postId, page, limit });

    return context.json(
      {
        data: likes,
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

//Like a post
likesRoutes.post("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = context.req.param("postId");

  try {
    const like = await likePost({ userId, postId });

    return context.json(
      {
        data: like,
      },
      201
    );
  } catch (e) {
    if (e === LikeError.ALREADY_LIKED) {
      return context.json(
        {
          error: "You have already liked this post",
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

//Unlike a post
likesRoutes.delete("/on/:postId", tokenMiddleware, async (context) => {
  const userId = context.get("userId");
  const postId = context.req.param("postId");

  try {
    const result = await unlikePost({ userId, postId });

    return context.json(
      {
        message: result.message,
      },
      200
    );
  } catch (e) {
    if (e === LikeError.NOT_FOUND) {
      return context.json(
        {
          error: "Like not found",
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
