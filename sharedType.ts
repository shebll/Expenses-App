import { z } from "zod";
import {
  expenseInsertSchema,
  expenseSelectSchema,
  tagInsertSchema,
  tagSelectSchema,
} from "./server/db/schema/expenseSchema";

export const CreateExpenseSchema = expenseInsertSchema.omit({
  userId: true,
  createdAt: true,
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial();

export const expenseClientSchema = expenseSelectSchema.extend({
  createdAt: z.date().transform((val) => (val ? new String(val) : null)),
});
export type ExpenseType = z.infer<typeof expenseClientSchema>;

////////////////////////////////////////////////////

export const CreateTagSchema = tagInsertSchema.omit({
  userId: true,
});

export const UpdateTagSchema = CreateTagSchema.partial();

export const tagClientSchema = tagSelectSchema.extend({
  createdAt: z.date().transform((val) => (val ? new String(val) : null)),
});
export type TagType = z.infer<typeof tagClientSchema>;

/////////////////////

const ExpenseWithTagsSchema = expenseClientSchema.extend({
  tag: tagClientSchema,
});

export type ExpenseWithTagsType = z.infer<typeof ExpenseWithTagsSchema>;
