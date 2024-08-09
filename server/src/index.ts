import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expensesRoutes } from "./routes/expenses";
import { tagsRoutes } from "./routes/tags";
// import analyticsRoutes from "./routes/analyticsRoutes";
import { Env } from "./types/type";
import { createAuthRoutes } from "./routes/auth";
// import manifestJSON from "../../src/assets-manifest.json";

const app = new Hono<Env>();

// logger
app.use("/*", logger());

// expensesRoutes handle all '/api/expenses' routes
const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expensesRoutes)
  .route("/tags", tagsRoutes)
  .route("/", createAuthRoutes());
// .route("/analytics", analyticsRoutes)

// make front-end handle all  routes do not found
app.get(
  "/assets/*",
  serveStatic({
    root: "./front-end/dist",
    // manifest: manifestJSON,
  })
);
app.get(
  "/*",
  serveStatic({
    root: "./front-end/dist",
    // manifest: manifestJSON,
  })
);

export default app;
export type ApiRoutes = typeof apiRoutes;
