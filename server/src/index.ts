import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoutes } from "./routes/expenses";

const app = new Hono();

// logger
app.use("/*", logger());

// expensesRoutes handle all '/api/expenses' routes
app.route("/api/expenses", expensesRoutes);

export default app;
