import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expensesRoutes } from "./routes/expenses";
import { tagsRoutes } from "./routes/tags";
import { authRoutes } from "./routes/auth";
const app = new Hono();

// logger
app.use("/*", logger());

// expensesRoutes handle all '/api/expenses' routes
const apiRoutes = app
  .basePath("/api")
  .route("/expenses", expensesRoutes)
  .route("/tags", tagsRoutes)
  .route("/", authRoutes);

// make front-end handle all  routes do not found
app.use("*", serveStatic({ root: "./front-end/dist" }));
app.get("*", serveStatic({ path: "./front-end/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
