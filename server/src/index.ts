import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expensesRoutes } from "./routes/expenses";
const app = new Hono();

// logger
app.use("/*", logger());

// expensesRoutes handle all '/api/expenses' routes
const appRoutes = app.basePath("/api").route("/expenses", expensesRoutes);

// make front-end handle all  routes do not found
app.use("*", serveStatic({ root: "./front-end/dist" }));
app.get("*", serveStatic({ path: "./front-end/dist/index.html" }));

export type apiRoutesType = typeof appRoutes;
export default app;
