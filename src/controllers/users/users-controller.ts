import { prismaClient } from "../../extras/prisma.js";
import {
  GetMeError,
  type GetAllUserResult,
  type GetMeResult,
} from "./users-type.js";

export const getMe = async (p: { userId: string }): Promise<GetMeResult> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: p.userId,
    },
  });

  if (!user) {
    throw GetMeError.BAD_REQUEST;
  }

  return {
    user,
  };
};

export const getAllUsers = async (): Promise<GetAllUserResult> => {
  const user = await prismaClient.user.findMany();

  return {
    user,
  };
};
