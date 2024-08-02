import {
  serial,
  text,
  pgTable,
  timestamp,
  integer,
  numeric,
  index,
} from "drizzle-orm/pg-core";
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
