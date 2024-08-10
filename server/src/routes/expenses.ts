import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getUser } from "../kinde";
import { expense as expenseTable } from "../../db/schema/expenseSchema";
import { tag as tagTable } from "../../db/schema/expenseSchema";
import { eq, and, desc, sum } from "drizzle-orm";
import { CreateExpenseSchema, UpdateExpenseSchema } from "../../../sharedType";

export const expensesRoutes = new Hono()
  .get("/total-expenses", getUser, async (c) => {
    const user = c.var.user;
    const db = c.var.db;

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
    const db = c.var.db;

    try {
      const expenses = await db
        .select({
          id: expenseTable.id,
          amount: expenseTable.amount,
          createdAt: expenseTable.createdAt,
          date: expenseTable.date,
          userId: expenseTable.userId,
          tagId: expenseTable.tagId,
          tag: {
            id: tagTable.id,
            tagName: tagTable.tagName,
            tagEmoji: tagTable.tagEmoji,
          },
        })
        .from(expenseTable)
        .leftJoin(tagTable, eq(expenseTable.tagId, tagTable.id))
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
    const id = Number(c.req.param("id"));

    const user = c.var.user;
    const db = c.var.db;

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
    const id = Number(c.req.param("id"));

    const user = c.var.user;
    const db = c.var.db;

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
    zValidator("json", CreateExpenseSchema, (result, c) => {
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
      const db = c.var.db;

      const data = c.req.valid("json");
      const expense = CreateExpenseSchema.parse(data);

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
  )
  .patch(
    "/:id",
    getUser,
    zValidator("json", UpdateExpenseSchema, (result, c) => {
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
      const db = c.var.db;

      const id = Number(c.req.param("id"));
      const data = c.req.valid("json");
      const updateData = UpdateExpenseSchema.parse(data);

      try {
        const updatedExpense = await db.transaction(async (tx) => {
          // First, check if the expense exists and belongs to the user
          const existingExpense = await tx
            .select()
            .from(expenseTable)
            .where(
              and(eq(expenseTable.id, id), eq(expenseTable.userId, user.id))
            )
            .limit(1)
            .then((r) => r[0]);

          if (!existingExpense) {
            throw new Error("Expense not found or does not belong to the user");
          }

          // If the expense exists, update it
          const updated = await tx
            .update(expenseTable)
            .set(updateData)
            .where(
              and(eq(expenseTable.id, id), eq(expenseTable.userId, user.id))
            )
            .returning();

          // Fetch the updated expense with tag information
          const updatedWithTag = await tx
            .select({
              id: expenseTable.id,
              amount: expenseTable.amount,
              createdAt: expenseTable.createdAt,
              userId: expenseTable.userId,
              tagId: expenseTable.tagId,
              tag: {
                id: tagTable.id,
                tagName: tagTable.tagName,
                tagEmoji: tagTable.tagEmoji,
              },
            })
            .from(expenseTable)
            .leftJoin(tagTable, eq(expenseTable.tagId, tagTable.id))
            .where(eq(expenseTable.id, updated[0].id))
            .limit(1)
            .then((r) => r[0]);

          return updatedWithTag;
        });

        c.status(200);
        return c.json({
          message: "Expense Updated Successfully",
          expense: updatedExpense,
        });
      } catch (error) {
        console.error("Error updating expense:", error);
        c.status(500);
        return c.json({ error: "Error updating expense" });
      }
    }
  );
