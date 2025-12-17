import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feed_follows, posts } from "../schema";

/**
 * A type matching the schema of the posts table in the database
 */
export type Post = typeof posts.$inferSelect;

/**
 * Creates a new post record on the posts table in the database
 * @param title The post's title
 * @param url The post's url
 * @param description The post's description
 * @param published_at The post's published at date
 * @param feed_id The id of the feed the post is from
 */
export async function createPost(title: string, url: string, description: string, published_at: Date, feed_id: string): Promise<void> {
    const checkUrl = await db.select({ url: posts.url }).from(posts).where(eq(posts.url, url));
    if (checkUrl.length === 0) {
        const [result] = await db.insert(posts)
            .values({ title: title, url: url, description: description, publishedAt: published_at, feedId: feed_id });
    }
}

/**
 * Gets a number of posts from the database for the given user id
 * @param user_id The id of the user to get the posts for
 * @param numberOfPosts The number of posts to get from the database, default 2
 * @returns An array of objects matching the query structure
 */
export async function getPostsForUser(user_id: string, numberOfPosts?: number):
    Promise<{
        id: string | null; createdAt: Date | null; updatedAt: Date | null; title: string |
            null; url: string | null; description: string | null; publishedAt: Date | null; feedId: string | null;
    }[]> {
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