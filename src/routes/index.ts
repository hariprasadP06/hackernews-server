import { Hono } from "hono";
import {
  signUpWithUsernameAndPassword,
  logInWithUsernameAndPassword,
} from "../controllers/auntentication/auntentication-index.js";
import {
  SignUpWithUsernameAndPasswordErrorCode,
  LogInWithUsernameAndPasswordErrorCode,
} from "../controllers/auntentication/auntentication-types.js";
import { Console } from "console";
import { createContext } from "vm";
import jwt from "jsonwebtoken";
import { prismaClient } from "../extras/prisma.js";
import { Private_Secret_Key } from "../../environment.js";

export const allRoutes = new Hono();
