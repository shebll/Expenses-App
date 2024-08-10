import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { logger } from "hono/logger";
import { expensesRoutes } from "./routes/expenses";
import { tagsRoutes } from "./routes/tags";
// import analyticsRoutes from "./routes/analyticsRoutes";
import { Env } from "./types/type";
import { createAuthRoutes } from "./routes/auth";
import { dbMiddleware } from "../db";
import manifestJSON from "../../src/assets-manifest.json";

const app = new Hono<Env>();

// logger
app.use("/*", logger());

// connect to db
app.use("/*", dbMiddleware);

const authRoutes = createAuthRoutes();
// expensesRoutes handle all '/api/expenses' routes
const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expensesRoutes)
  .route("/tags", tagsRoutes)
  .route("/", authRoutes);
// .route("/analytics", analyticsRoutes)

// make front-end handle all  routes do not found
app.get(
  "/assets/*",
  serveStatic({
    root: "./front-end/dist",
    manifest: manifestJSON,
  })
);
app.get(
  "/*",
  serveStatic({
    root: "./front-end/dist",
    manifest: manifestJSON,
  })
);

app.get(
  "/static/*",
  serveStatic({ root: "./front-end/dist", manifest: manifestJSON })
);
app.get(
  "/favicon.ico",
  serveStatic({ path: "./front-end/dist/vite.svg", manifest: manifestJSON })
);
export default app;
export type ApiRoutes = typeof apiRoutes;
