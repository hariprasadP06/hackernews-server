import { createHash } from "crypto";

import {
  LogInWithUsernameAndPasswordErrorCode,
  SignUpWithUsernameAndPasswordErrorCode,
  type LogInWithUsernameAndPasswordResult,
  type SignUpWithUsernameAndPasswordResult,
} from "./auntentication-types.js";
import { prismaClient } from "../../extras/prisma.js";
import jwt from "jsonwebtoken";
import { Private_Secret_Key } from "../../../environment.js";

const createJWToken = (p: { id: string; username: string }): string => {
  const jwtPayload: jwt.JwtPayload = {
    iss: "http://github.com/hariprasadP06",
    sub: p.id,
    username: p.username,
  };

  const token = jwt.sign(jwtPayload, Private_Secret_Key, {
    expiresIn: "20d",
  });
  return token;
};

export const checkIfUserExistsAlready = async (p: {
  username: string;
}): Promise<boolean> => {
  const user_exist = await prismaClient.user.findUnique({
    where: {
      username: p.username,
    },
  });

  if (user_exist) {
    return true;
  }
  return false;
};

export const createPasswordHash = (p: { password: string }): string => {
  return createHash("sha256").update(p.password).digest("hex");
};

export const signUpWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  const isUserExistingAlready = await checkIfUserExistsAlready({
    username: parameters.username,
  });

  if (isUserExistingAlready) {
    throw SignUpWithUsernameAndPasswordErrorCode.CONFLICTING_USERNAME;
  }

  const passwordHash = createPasswordHash({
    password: parameters.password,
  });

  const user = await prismaClient.user.create({
    data: {
      username: parameters.username,
      password: passwordHash,
    },
  });

  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  const result: SignUpWithUsernameAndPasswordResult = {
    token,
    user,
  };

  return result;
};

export const logInWithUsernameAndPassword = async (p: {
  username: string;
  password: string;
}): Promise<LogInWithUsernameAndPasswordResult> => {
  const passwordHash = createPasswordHash({
    password: p.password,
  });
  const user = await prismaClient.user.findUnique({
    where: {
      username: p.username,
      password: passwordHash,
    },
  });

  if (!user) {
    throw LogInWithUsernameAndPasswordErrorCode.INCORRECT_USERNMAE_OR_PASSWORD;
  }

  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  return {
    token,
    user,
  };
};
