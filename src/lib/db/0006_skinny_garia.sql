CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" text,
	"url" text,
	"description" text,
	"published_at" timestamp,
	"feed_id" text NOT NULL,
	CONSTRAINT "posts_url_unique" UNIQUE("url")
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_name_unique";