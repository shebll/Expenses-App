import {
  serial,
  text,
  pgTable,
  timestamp,
  integer,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
export const expense = pgTable(
  "expense",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    tagId: integer("tag_id") // Ensure this is an integer to match the tag id
      .notNull()
      .references(() => tag.id),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (expense) => {
    return {
      userIdIndex: index("user_id_index").on(expense.userId),
      tagIdIndex: index("tag_id_index").on(expense.tagId),
    };
  }
);

export const tag = pgTable("tag", {
  id: serial("id").primaryKey(),
  tagName: text("tag_name").notNull(),
  userId: text("user_id").notNull(),
  tagEmoji: text("tag_emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const expenseInsertSchema = createInsertSchema(expense, {
  amount: z.string().refine(
    (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    {
      message: "must be a positive number",
    }
  ),
  tagId: z.coerce
    .number({
      required_error: "Tag is required",
      invalid_type_error: "Expected number, received string",
    })
    .int()
    .positive({
      message: "You have Select Tag",
    }),
});
export const expenseSelectSchema = createSelectSchema(expense);

export const tagInsertSchema = createInsertSchema(tag, {
  tagName: z.string().min(3).max(20),
  tagEmoji: z.string(),
});
export const tagSelectSchema = createSelectSchema(tag);
