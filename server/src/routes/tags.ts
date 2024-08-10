import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, and } from "drizzle-orm";
import { tag as tagTable } from "../../db/schema/expenseSchema";
import { getUser } from "../kinde";
import { CreateTagSchema } from "../../../sharedType";
export const tagsRoutes = new Hono()
  // Get all tags
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const db = c.var.db;

    const tags = await db
      .select()
      .from(tagTable)
      .where(eq(tagTable.userId, user.id));
    return c.json({ tags });
  })
  // Get tag by id
  .get("/:id", getUser, async (c) => {
    const id = Number(c.req.param("id"));

    const db = c.var.db;
    const user = c.var.user;

    const tag = await db
      .select()
      .from(tagTable)
      .where(and(eq(tagTable.id, id), eq(tagTable.userId, user.id)))
      .limit(1)
      .then((r) => r[0]);

    if (!tag) return c.notFound();
    return c.json({ tag });
  })
  // Delete tag by id
  .delete("/:id", getUser, async (c) => {
    const id = Number(c.req.param("id"));

    const db = c.var.db;
    const user = c.var.user;

    const deleted = await db
      .delete(tagTable)
      .where(and(eq(tagTable.id, id), eq(tagTable.userId, user.id)))
      .returning()
      .then((r) => r[0]);

    if (!deleted) return c.notFound();
    return c.json({ message: "Deleted Successfully", deleted });
  })
  // Add new tag
  .post(
    "/",
    getUser,
    zValidator("json", CreateTagSchema, (result, c) => {
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
      const data = c.req.valid("json");

      const db = c.var.db;
      const user = c.var.user;

      const tag = CreateTagSchema.parse(data);
      const newTag = await db
        .insert(tagTable)
        .values({ ...tag, userId: user.id })
        .returning();

      c.status(201);
      return c.json({ message: "Tag Created Successfully", tag: newTag[0] });
    }
  )
  // Update existing tag
  .put(
    "/:id",
    getUser,
    zValidator("json", CreateTagSchema, (result, c) => {
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
      const db = c.var.db;
      const user = c.var.user;

      const id = Number(c.req.param("id"));
      const data = c.req.valid("json");
      const updatedTag = await db
        .update(tagTable)
        .set({ ...data, userId: user.id })
        .where(and(eq(tagTable.id, id), eq(tagTable.userId, user.id)))
        .returning();

      if (updatedTag.length === 0) return c.notFound();
      return c.json({
        message: "Tag Updated Successfully",
        tag: updatedTag[0],
      });
    }
  );
