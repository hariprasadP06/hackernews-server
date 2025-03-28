import type { Like } from "@prisma/client";

export type LikePostResult = {
  like: Like;
};

export type UnlikePostResult = {
  message: string;
};

export type GetAllLikesResult = {
  likes: Like[];
};

export enum LikeError {
  ALREADY_LIKED,
  NOT_FOUND,
}
