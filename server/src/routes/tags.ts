import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const tagSchema = z.object({
  id: z.number().int().positive().min(1),
  tagName: z.string().min(3).max(20),
  emoji: z.string(),
});

const createTagSchema = tagSchema.omit({ id: true });
type Tag = z.infer<typeof tagSchema>;

let tags: Tag[] = [
  { id: 1, tagName: "rent", emoji: "🏠" },
  { id: 2, tagName: "health", emoji: "💊" },
  { id: 3, tagName: "food", emoji: "🍕" },
  { id: 4, tagName: "clothes", emoji: "👚" },
  { id: 5, tagName: "gift", emoji: "🎁" },
  { id: 6, tagName: "education", emoji: "📚" },
  { id: 7, tagName: "vacation", emoji: "🏖️" },
  { id: 8, tagName: "groceries", emoji: "🥦" },
];

export const tagsRoutes = new Hono()
  // Get all tags
  .get("/", (c) => {
    return c.json({ tags });
  })
  // Get tag by id
  .get("/:id{[0-9]+}", (c) => {
    const id = Number(c.req.param("id"));
    const tag = tags.find((tag) => tag.id === id);
    if (!tag) return c.notFound();
    return c.json({ tag });
  })
  // Delete tag by id
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number(c.req.param("id"));
    const index = tags.findIndex((tag) => tag.id === id);
    if (index === -1) return c.notFound();
    tags = tags.filter((tag) => tag.id !== id);
    return c.json({ message: "Deleted Successfully" });
  })
  // Add new tag
  .post(
    "/",
    zValidator("json", createTagSchema, (result, c) => {
      // Handling Invalid Data
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
      const tag = createTagSchema.parse(data);
      tags.push({ id: +Date.now(), ...tag });
      c.status(201);
      return c.json({ message: "Tag Created Successfully", tag });
    }
  )
  // Update existing tag
  .put(
    "/:id{[0-9]+}",
    zValidator("json", createTagSchema, (result, c) => {
      // Handling Invalid Data
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
      const id = Number(c.req.param("id"));
      const data = c.req.valid("json");
      const index = tags.findIndex((tag) => tag.id === id);
      if (index === -1) return c.notFound();
      tags[index] = { id, ...data };
      return c.json({ message: "Tag Updated Successfully", tag: tags[index] });
    }
  );
