import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

/**
 * Defines the schema for the users table in the database
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  name: text("name").notNull(),
});

/**
 * Defines the schema for the feeds table in the database
 */
export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
  last_fetched_at: timestamp("last_fetched_at"),
});

/**
 * Defines the schema for the feed_follows table in the database
 */
export const feed_follows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  user_id: uuid("user_id").references(() => users.id, {onDelete: 'cascade'}).notNull(),
  feed_id: uuid("feed_id").references(() => feeds.id, {onDelete: 'cascade'}).notNull(),
}, (t) => [
  unique().on(t.user_id, t.feed_id)
]);

/**
 * Defines the schema for the posts table in the database
 */
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
  title: text("title"),
  url: text("url").unique(),
  description: text("description"),
  publishedAt: timestamp("published_at"),
  feedId: uuid("feed_id").references(() => feeds.id, {onDelete: 'cascade'}).notNull(),
});