import { Hono } from "hono";
import {
  signUpWithUsernameAndPassword,
  logInWithUsernameAndPassword,
} from "../controllers/authentication/authentication-index.js";
import {
  SignUpWithUsernameAndPasswordErrorCode,
  LogInWithUsernameAndPasswordErrorCode,
} from "../controllers/authentication/auntentication-types.js";

export const authenticationRoutes = new Hono();

authenticationRoutes.post("/sign-up", async (context) => {
  const { username, password } = await context.req.json();

  try {
    const result = await signUpWithUsernameAndPassword({
      username,
      password,
    });

    return context.json(
      {
        data: result,
      },
      201
    );
  } catch (e) {
    if (e === SignUpWithUsernameAndPasswordErrorCode.CONFLICTING_USERNAME) {
      return context.json(
        {
          message: "Username already exists",
        },
        409
      );
    }

    return context.json(
      {
        mesage: "Unknown",
      },
      500
    );
  }
});

authenticationRoutes.post("/log-in", async (context) => {
  try {
    const { username, password } = await context.req.json();

    const result = await logInWithUsernameAndPassword({
      username,
      password,
    });

    return context.json(
      {
        data: result,
      },
      201
    );
  } catch (e) {
    if (
      e === LogInWithUsernameAndPasswordErrorCode.INCORRECT_USERNMAE_OR_PASSWORD
    ) {
      return context.json(
        {
          message: "Incorrect username or password",
        },
        401
      );
    }

    return context.json(
      {
        message: "Unknown",
      },
      500
    );
  }
});
