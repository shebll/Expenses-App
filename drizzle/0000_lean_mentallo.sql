CREATE TABLE IF NOT EXISTS "expense" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tag_id" integer NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag_name" text NOT NULL,
	"user_id" text NOT NULL,
	"tag_emoji" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expense" ADD CONSTRAINT "expense_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "expense" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tag_id_index" ON "expense" USING btree ("tag_id");