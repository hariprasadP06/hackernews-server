import { Hono } from "hono";
import {
  signUpWithUsernameAndPassword,
  logInWithUsernameAndPassword,
} from "../controllers/authentication/authentication-index.js";
import {
  SignUpWithUsernameAndPasswordErrorCode,
  LogInWithUsernameAndPasswordErrorCode,
} from "../controllers/authentication/auntentication-types.js";
import { Console } from "console";
import { createContext } from "vm";
import jwt from "jsonwebtoken";
import { prismaClient } from "../extras/prisma.js";
import { Private_Secret_Key } from "../../environment.js";
import { authenticationRoutes } from "./authentication-routes.js";
import { postsRoutes } from "./post-routes.js";
import { likesRoutes } from "./like-routes.js";
import { commentsRoutes } from "./comments-routes.js";

export const allRoutes = new Hono();

allRoutes.route("/authentication", authenticationRoutes);

allRoutes.get(
  "/user",
  async (c, next) => {
    const token = c.req.header("token");
    if (!token) {
      return c.json(
        {
          message: "Missing Token",
        },
        401
      );
    }

    try {
      const verified = jwt.verify(token, Private_Secret_Key);

      await next();
    } catch (e) {
      return c.json(
        {
          message: "Invalid Token",
        },
        401
      );
    }
  },
  async (c) => {
    const user = await prismaClient.user.findMany();
    return c.json(user, 200);
  }
);

allRoutes.route("/posts", postsRoutes);
allRoutes.route("/like", likesRoutes);
allRoutes.route("/comments", commentsRoutes);
