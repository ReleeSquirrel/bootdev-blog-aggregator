import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, posts } from "../schema";

export type Post = typeof posts.$inferSelect;

export async function createPost(title: string, url: string, description: string, published_at: Date, feed_id: string): Promise<void> {
    const checkUrl = await db.select({ url: posts.url }).from(posts).where(eq(posts.url, url));
    if (checkUrl.length === 0) {
        const [result] = await db.insert(posts)
            .values({ title: title, url: url, description: description, publishedAt: published_at, feedId: feed_id });
    }
}

export async function getPostsForUser(user_id: string, numberOfPosts?: number) {
    if (numberOfPosts) {
        const result = await db.select({
            id: posts.id, createdAt: posts.createdAt, updatedAt: posts.updatedAt, title: posts.title,
            url: posts.url, description: posts.description, publishedAt: posts.publishedAt, feedId: posts.feedId
        }).from(feed_follows)
            .leftJoin(posts, eq(feed_follows.feed_id, posts.feedId))
            .where(eq(feed_follows.user_id, user_id))
            .limit(numberOfPosts)
            .orderBy(desc(posts.publishedAt));
        return result;
    } else {
        const result = await db.select({
            id: posts.id, createdAt: posts.createdAt, updatedAt: posts.updatedAt, title: posts.title,
            url: posts.url, description: posts.description, publishedAt: posts.publishedAt, feedId: posts.feedId
        }).from(feed_follows)
            .leftJoin(posts, eq(feed_follows.feed_id, posts.feedId))
            .where(eq(feed_follows.user_id, user_id))
            .orderBy(desc(posts.publishedAt));
        return result;
    }
}