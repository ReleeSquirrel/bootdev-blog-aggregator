import { db } from "..";
import { feeds, users } from "../schema";
import { sql, eq } from "drizzle-orm";

/**
 * A type matching the schema of the feeds table in the database
 */
export type Feed = typeof feeds.$inferSelect;

/**
 * Creates a new feed record in the database
 * @param name The name of the feed
 * @param url The url of the feed
 * @param user_id The user_id of the user creating the feed
 * @returns An object containing the data of the record inserted into the database
 */
export async function createFeed(name: string, url: string, user_id: string): Promise<Feed> {
    const [result] = await db.insert(feeds)
        .values({ name: name, url: url, user_id: user_id, last_fetched_at: null }).returning();
    return result;
}

/**
 * Gets a feed record from the feeds database with the matching url
 * @param url The url of the feed to get
 * @returns An object containing a record from the feeds table
 */
export async function getFeedByUrl(url: string): Promise<Feed> {
    const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
    return result;
}

/**
 * Gets all records from the feeds table along with the user name of the user who created each record
 * @returns An object containing a record from the feeds table plus the username of the user who created it
 */
export async function getFeedsPlusUsername(): Promise<{ feedname: string; url: string; username: string; }[]> {
    const result = await db.select({ feedname: feeds.name, url: feeds.url, username: users.name })
        .from(feeds).innerJoin(users, eq(feeds.user_id, users.id));
    return result;
}

/**
 * Updates the last_fetched_at field of the feed record matching the feed id given
 * @param id The id of the feed to mark
 */
export async function markFeedFetched(id: string) {
    await db.update(feeds)
        .set({ 
            last_fetched_at: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        })
        .where(eq(feeds.id, id));
}

/**
 * Gets a record of the feed with the oldest last_fetched_at date
 * @returns An object containing a record of the feed with the oldest last_fetched_at date
 */
export async function getNextFeedToFetch(): Promise<{ id: string; createdAt: Date; updatedAt: Date; name: string; url: string; user_id: string; last_fetched_at: Date | null; }> {
    const [result] = await db.select().from(feeds).limit(1)
        .orderBy(sql`${feeds.last_fetched_at} asc nulls first`, sql`${feeds.updatedAt} asc nulls first`);
    if (!result) {
        throw new Error(`Error: No feeds in the database to fetch.`);
    }
    return result;
}