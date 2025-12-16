import { db } from "..";
import { feeds, users } from "../schema";
import { sql, eq } from "drizzle-orm";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string, url: string, user_id: string): Promise<Feed> {
    const [result] = await db.insert(feeds)
        .values({ name: name, url: url, user_id: user_id, last_fetched_at: null }).returning();
    return result;
}

export async function getFeedByUrl(url: string): Promise<Feed> {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

export async function getFeedsPlusUsername(): Promise<{ feedname: string; url: string; username: string; }[]> {
    const result = await db.select({ feedname: feeds.name, url: feeds.url, username: users.name })
        .from(feeds).innerJoin(users, eq(feeds.user_id, users.id));
    return result;
}

export async function markFeedFetched(id: string) {
    await db.update(feeds)
        .set({ 
            last_fetched_at: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        })
        .where(eq(feeds.id, id));
}

export async function getNextFeedToFetch(): Promise<{ id: string; createdAt: Date; updatedAt: Date; name: string; url: string; user_id: string; last_fetched_at: Date | null; }> {
    const [result] = await db.select().from(feeds).limit(1)
        .orderBy(sql`${feeds.last_fetched_at} asc nulls first`, sql`${feeds.updatedAt} asc nulls first`);
    if (!result) {
        throw new Error(`Error: No feeds in the database to fetch.`);
    }
    return result;
}