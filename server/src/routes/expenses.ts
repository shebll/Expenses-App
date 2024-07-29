import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  amount: z.number().positive().min(0.1),
  title: z.string().min(3).max(20),
  tag: z.object({
    tagName: z.string().min(3).max(20),
    emoji: z.string(),
  }),
});

const createSchema = expenseSchema.omit({ id: true });
type Expense = z.infer<typeof expenseSchema>;

let expenses: Expense[] = [
  {
    title: "goes to rent",
    amount: 121,
    tag: { tagName: "rent", emoji: "💸" },
    id: 1722188242366,
  },
  {
    title: "home",
    amount: 10,
    tag: { tagName: "Gas", emoji: "💸" },
    id: 1722188242366,
  },
  {
    title: "home",
    amount: 90,
    tag: { tagName: "Food", emoji: "💸" },
    id: 1722188242366,
  },
  {
    title: "home",
    amount: 39,
    tag: { tagName: "Fun", emoji: "💸" },
    id: 1722188242366,
  },
];

export const expensesRoutes = new Hono()
  //Get all expenses
  .get("/", (c) => {
    return c.json({ expenses });
  })
  //Get by id
  .get("/:id{[0-9]+}", (c) => {
    const id = Number(c.req.param("id"));
    const expense = expenses.find((expense) => expense.id === id);
    if (!expense) return c.notFound();
    return c.json({ expense });
  })
  //Delete by id
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number(c.req.param("id"));
    const index = expenses.findIndex((expense) => expense.id === id);
    if (index === -1) return c.notFound();
    expenses = expenses.filter((expense) => expense.id !== id);
    return c.json({ message: "Deleted Successfully" });
  })
  //Get total amount expenses
  .get("/total-expenses", (c) => {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return c.json({ totalExpenses });
  })
  //Add new expenses
  .post(
    "/",
    zValidator("json", createSchema, (result, c) => {
      // handling Invalid Data
      if (!result.success) {
        c.status(400);
        return c.json({
          message: "Invalid Data",
          errors: result.error.errors.map((error) => {
            return {
              path: `in ${error.path}`,
              message: error.message,
            };
          }),
        });
      }
    }),
    async (c) => {
      const data = c.req.valid("json");
      const expense = createSchema.parse(data);
      expenses.push({ id: +Date.now(), ...expense });
      c.status(201);
      return c.json({ message: "Expense Created Successfully", expense });
    }
  );
