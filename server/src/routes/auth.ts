import { Hono } from "hono";
import { getUser, kindeClient, sessionManager } from "../kinde";

export const authRoutes = new Hono()
  .get("/login", async (c) => {
    try {
      const loginUrl = await kindeClient.login(sessionManager(c));
      console.log("////////////////", loginUrl);
      return c.redirect(loginUrl.toString());
    } catch (e) {
      console.error("Login Error:", e);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  .get("/register", async (c) => {
    try {
      const registerUrl = await kindeClient.register(sessionManager(c));
      return c.redirect(String(registerUrl));
    } catch (e) {
      console.error("Register Error:", e);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  .get("/callback", async (c) => {
    try {
      const url = new URL(c.req.url);
      await kindeClient.handleRedirectToApp(sessionManager(c), url);
      return c.redirect("/");
    } catch (e) {
      console.error("Callback Error:", e);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  .get("/logout", async (c) => {
    try {
      const logoutUrl = await kindeClient.logout(sessionManager(c));
      return c.redirect(logoutUrl.toString());
    } catch (e) {
      console.error("Logout Error:", e);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  .get("/me", getUser, async (c) => {
    try {
      const user = c.var.user;
      return c.json({ user });
    } catch (e) {
      console.error("User Info Error:", e);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });
