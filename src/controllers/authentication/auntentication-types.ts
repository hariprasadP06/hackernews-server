import type { User } from "@prisma/client";

export type SignUpWithUsernameAndPasswordResult = {
  user: User;
  token: string;
};

export enum SignUpWithUsernameAndPasswordErrorCode {
  CONFLICTING_USERNAME = "CONFLICTING_USERNAME",
  UNKNOWN = "UNKNOWN",
}

export type LogInWithUsernameAndPasswordResult = {
  user: User;
  token: string;
};

export enum LogInWithUsernameAndPasswordErrorCode {
  INCORRECT_USERNMAE_OR_PASSWORD = "INCORRECT_USERNMAE_OR_PASSWORD",
  UNKNOWN = "UNKNOWN",
}
