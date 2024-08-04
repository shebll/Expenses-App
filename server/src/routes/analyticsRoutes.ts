import { Hono } from "hono";
import { getUser } from "../kinde";
import { db } from "../../db/index";
import { expense as expenseTable } from "../../db/schema/expenseSchema";
import { tag as tagTable } from "../../db/schema/expenseSchema";
import { eq, sum, count, max, sql } from "drizzle-orm";

export const analyticsRoutes = new Hono()
  // Get monthly expenses
  .get("/monthly-expenses", getUser, async (c) => {
    const user = c.var.user;
    const monthlyExpenses = await db
      .select({
        month: sql<string>`DATE_TRUNC('month', ${expenseTable.createdAt})`,
        totalAmount: sum(expenseTable.amount),
      })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .groupBy(sql`DATE_TRUNC('month', ${expenseTable.createdAt})`)
      .orderBy(sql`DATE_TRUNC('month', ${expenseTable.createdAt})`);

    return c.json(monthlyExpenses);
  })
  // Get daily expenses over weeks
  .get("/weekly-daily-expenses", getUser, async (c) => {
    const user = c.var.user;
    const weeklyDailyExpenses = await db
      .select({
        date: expenseTable.createdAt,
        weekStart: sql<string>`DATE_TRUNC('week', ${expenseTable.createdAt})`,
        totalAmount: sum(expenseTable.amount),
      })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .groupBy(expenseTable.createdAt)
      .orderBy(expenseTable.createdAt);

    return c.json(weeklyDailyExpenses);
  })
  // Get most frequent tag per week
  .get("/most-frequent-tag-weekly", getUser, async (c) => {
    const user = c.var.user;
    const frequentTagWeekly = await db
      .select({
        weekStart: sql<string>`DATE_TRUNC('week', ${expenseTable.createdAt})`,
        tagId: expenseTable.tagId,
        tagName: tagTable.tagName,
        tagEmoji: tagTable.tagEmoji,
        count: count(expenseTable.id),
      })
      .from(expenseTable)
      .leftJoin(tagTable, eq(expenseTable.tagId, tagTable.id))
      .where(eq(expenseTable.userId, user.id))
      .groupBy(
        sql`DATE_TRUNC('week', ${expenseTable.createdAt})`,
        expenseTable.tagId,
        tagTable.tagName,
        tagTable.tagEmoji
      )
      .orderBy(
        sql`DATE_TRUNC('week', ${expenseTable.createdAt})`,
        count(expenseTable.id)
      );

    return c.json(frequentTagWeekly);
  })
  // Get most frequent tag per month
  .get("/most-frequent-tag-monthly", getUser, async (c) => {
    const user = c.var.user;
    const frequentTagMonthly = await db
      .select({
        monthStart: sql<string>`DATE_TRUNC('month', ${expenseTable.createdAt})`,
        tagId: expenseTable.tagId,
        tagName: tagTable.tagName,
        tagEmoji: tagTable.tagEmoji,
        count: count(expenseTable.id),
      })
      .from(expenseTable)
      .leftJoin(tagTable, eq(expenseTable.tagId, tagTable.id))
      .where(eq(expenseTable.userId, user.id))
      .groupBy(
        sql`DATE_TRUNC('month', ${expenseTable.createdAt})`,
        expenseTable.tagId,
        tagTable.tagName,
        tagTable.tagEmoji
      )
      .orderBy(
        sql`DATE_TRUNC('month', ${expenseTable.createdAt})`,
        count(expenseTable.id)
      );

    return c.json(frequentTagMonthly);
  })
  // Get highest expense per week
  .get("/highest-expense-weekly", getUser, async (c) => {
    const user = c.var.user;
    const highestExpenseWeekly = await db
      .select({
        weekStart: sql<string>`DATE_TRUNC('week', ${expenseTable.createdAt})`,
        id: expenseTable.id,
        amount: expenseTable.amount,
        createdAt: expenseTable.createdAt,
        tagId: expenseTable.tagId,
        tagName: tagTable.tagName,
        tagEmoji: tagTable.tagEmoji,
      })
      .from(expenseTable)
      .leftJoin(tagTable, eq(expenseTable.tagId, tagTable.id))
      .where(eq(expenseTable.userId, user.id))
      .orderBy(
        sql`DATE_TRUNC('week', ${expenseTable.createdAt})`,
        expenseTable.amount
      );

    return c.json(highestExpenseWeekly);
  })
  // Get highest expense per month
  .get("/highest-expense-monthly", getUser, async (c) => {
    const user = c.var.user;
    const highestExpenseMonthly = await db
      .select({
        monthStart: sql<string>`DATE_TRUNC('month', ${expenseTable.createdAt})`,
        id: expenseTable.id,
        amount: expenseTable.amount,
        createdAt: expenseTable.createdAt,
        tagId: expenseTable.tagId,
        tagName: tagTable.tagName,
        tagEmoji: tagTable.tagEmoji,
      })
      .from(expenseTable)
      .leftJoin(tagTable, eq(expenseTable.tagId, tagTable.id))
      .where(eq(expenseTable.userId, user.id))
      .orderBy(
        sql`DATE_TRUNC('month', ${expenseTable.createdAt})`,
        expenseTable.amount
      );

    return c.json(highestExpenseMonthly);
  });

export default analyticsRoutes;
