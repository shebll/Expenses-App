import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { db } from "../../db/index";
import { expense as expenseTable } from "../../db/schema/expenseSchema";
import { eq, and, desc, sum } from "drizzle-orm";

const expenseSchema = z.object({
  amount: z.string(),
  tagId: z.number().int().positive(),
});

const createSchema = expenseSchema;
type Expense = z.infer<typeof expenseSchema>;

export const expensesRoutes = new Hono() // Get total amount expenses
  .get("/total-expenses", getUser, async (c) => {
    const user = c.var.user;
    const totalExpenses = await db
      .select({ totalExpenses: sum(expenseTable.amount) })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .limit(1)
      .then((r) => r[0]);

    return c.json(totalExpenses);
  })
  // Get all expenses
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    console.log("User:", user);

    try {
      const expenses = await db
        .select()
        .from(expenseTable)
        .where(eq(expenseTable.userId, user.id))
        .orderBy(desc(expenseTable.createdAt))
        .limit(100);

      console.log("Expenses:", expenses);

      return c.json({ expenses });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return c.json({ error: "Error fetching expenses" }, 500);
    }
  })
  // Get by id
  .get("/:id", getUser, async (c) => {
    const user = c.var.user;
    const id = Number(c.req.param("id"));
    const expense = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.id, id), eq(expenseTable.userId, user.id)))
      .limit(1)
      .then((r) => r[0]);

    if (!expense) return c.notFound();
    return c.json({ expense });
  })
  // Delete by id
  .delete("/:id", getUser, async (c) => {
    const user = c.var.user;
    const id = Number(c.req.param("id"));
    const deleted = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.id, id), eq(expenseTable.userId, user.id)))
      .returning()
      .then((r) => r[0]);

    if (!deleted) return c.notFound();
    return c.json({ message: "Deleted Successfully", deleted });
  })

  // Add new expenses
  .post(
    "/",
    getUser,
    zValidator("json", createSchema, (result, c) => {
      if (!result.success) {
        c.status(400);
        return c.json({
          message: "Invalid Data",
          errors: result.error.errors.map((error) => ({
            path: `in ${error.path}`,
            message: error.message,
          })),
        });
      }
    }),
    async (c) => {
      const user = c.var.user;
      const data = c.req.valid("json");
      const expense = createSchema.parse(data);
      const newExpense = await db
        .insert(expenseTable)
        .values({
          ...expense,
          userId: user.id,
        })
        .returning();

      c.status(201);
      return c.json({
        message: "Expense Created Successfully",
        expense: newExpense[0],
      });
    }
  );
