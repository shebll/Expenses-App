import {
  createKindeServerClient,
  GrantType,
  SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { Env } from "./types/type";

export function createKindeClient(c: Context<Env>) {
  return createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: c.env.KINDE_DOMAIN!,
    clientId: c.env.KINDE_CLIENT_ID!,
    clientSecret: c.env.KINDE_CLIENT_SECRET!,
    redirectURL: c.env.KINDE_REDIRECT_URI!,
    logoutRedirectURL: c.env.KINDE_LOGOUT_REDIRECT_URI!,
  });
}

export const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    const result = getCookie(c, key);
    return result;
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    } as const;
    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});

export const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const kindeClient = createKindeClient(c);
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    if (!isAuthenticated) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const user = await kindeClient.getUserProfile(manager);
    c.set("user", user);
    await next();
  } catch (e) {
    console.error(e);
    return c.json({ error: "Unauthorized" }, 401);
  }
});

// import {
//   createKindeServerClient,
//   GrantType,
//   SessionManager,
//   UserType,
// } from "@kinde-oss/kinde-typescript-sdk";
// import { createMiddleware } from "hono/factory";
// import { Context } from "hono";
// import { Env } from "./types/type";

// import { deleteCookie, getCookie, setCookie } from "hono/cookie";

// // Client for authorization code flow
// export const kindeClient = createKindeServerClient(
//   GrantType.AUTHORIZATION_CODE,
//   {
//     authDomain: c.env.KINDE_DOMAIN!,
//     clientId: c.env.KINDE_CLIENT_ID!,
//     clientSecret: c.env.KINDE_CLIENT_SECRET!,
//     redirectURL: c.env.KINDE_REDIRECT_URI!,
//     logoutRedirectURL: c.env.KINDE_LOGOUT_REDIRECT_URI!,
//   }
// );

// export const sessionManager = (c: Context): SessionManager => ({
//   async getSessionItem(key: string) {
//     const result = getCookie(c, key);
//     return result;
//   },
//   async setSessionItem(key: string, value: unknown) {
//     const cookieOptions = {
//       httpOnly: true,
//       secure: true,
//       sameSite: "Lax",
//     } as const;
//     if (typeof value === "string") {
//       setCookie(c, key, value, cookieOptions);
//     } else {
//       setCookie(c, key, JSON.stringify(value), cookieOptions);
//     }
//   },
//   async removeSessionItem(key: string) {
//     deleteCookie(c, key);
//   },
//   async destroySession() {
//     ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
//       deleteCookie(c, key);
//     });
//   },
// });

// // type Env = {
// //   Variables: {
// //     user: UserType;
// //   };
// // };

// export const getUser = createMiddleware<Env>(async (c, next) => {
//   try {
//     const manager = sessionManager(c);
//     const isAuthenticated = await kindeClient.isAuthenticated(manager);
//     if (!isAuthenticated) {
//       return c.json({ error: "Unauthorized" }, 401);
//     }
//     const user = await kindeClient.getUserProfile(manager);
//     c.set("user", user);
//     await next();
//   } catch (e) {
//     console.error(e);
//     return c.json({ error: "Unauthorized" }, 401);
//   }
// });

// export function createKindeClient(c: Context<Env>) {
//   return createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
//     authDomain: c.env.KINDE_DOMAIN!,
//     clientId: c.env.KINDE_CLIENT_ID!,
//     clientSecret: c.env.KINDE_CLIENT_SECRET!,
//     redirectURL: c.env.KINDE_REDIRECT_URI!,
//     logoutRedirectURL: c.env.KINDE_LOGOUT_REDIRECT_URI!,
//   });
// }
