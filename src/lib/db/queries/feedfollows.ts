import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "./users";
import { getFeedByUrl } from "./feeds";

/**
 * A type matching the schema of the feed_follows table in the database
 */
export type FeedFollow = typeof feed_follows.$inferSelect;

/**
 * Creates a new record in the feed_follow database
 * @param user_id The user_id for the feed_follow record
 * @param feed_id The feed_id for the feed_follow record
 * @returns An object containing the record created in the database, plus the user name and feed name associated with the user_id and feed_id
 */
export async function createFeedFollow(user_id: string, feed_id: string): 
    Promise<{ id: string; createdAt: Date; updatedAt: Date; user_id: string; 
        feed_id: string; user_name: string; feed_name: string; }> {

    const [new_feed_follow] = await db.insert(feed_follows)
        .values({ user_id: user_id, feed_id: feed_id }).returning();

    const [result] = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        user_id: feed_follows.user_id,
        feed_id: feed_follows.feed_id,
        user_name: users.name,
        feed_name: feeds.name,
        }).from(feed_follows)
        .innerJoin(users, eq( feed_follows.user_id, users.id))
        .innerJoin(feeds, eq( feed_follows.feed_id, feeds.id))
        .where(eq(feed_follows.id, new_feed_follow.id));

    return result;
}

/**
 * Gets records of the feeds that the given user follows
 * @param user_name The user name whose feed follows to get
 * @returns An array of objects containing the feeds followed by the given user, along with their user name and the name of the feed
 */
export async function getFeedFollowsForUser(user_name: string): Promise<{ id: string; createdAt: Date; updatedAt: Date; user_id: string; feed_id: string; user_name: string; feed_name: string; }[]> {
    const [user] = await getUser(user_name);
    if (!user) {
        throw new Error(`Error: No user with name ${user_name} found.`);
    }
    const result = await db.select({
        id: feed_follows.id,
        createdAt: feed_follows.createdAt,
        updatedAt: feed_follows.updatedAt,
        user_id: feed_follows.user_id,
        feed_id: feed_follows.feed_id,
        user_name: users.name,
        feed_name: feeds.name,
        }).from(feed_follows)
        .innerJoin(users, eq( feed_follows.user_id, users.id))
        .innerJoin(feeds, eq( feed_follows.feed_id, feeds.id))
        .where(eq(feed_follows.user_id, user.id));
    return result;
}

/**
 * Deletes a record from the feed_follows table with the matching user_id and url
 * @param user_id The user id of the record to delete
 * @param url The url of the record to delete
 */
export async function deleteFeedFollowByUserIdAndFeedUrl(user_id: string, url: string): Promise<void> {
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Error: No feed matching ${url} was found.`);
    }
    await db.delete(feed_follows)
        .where(and(eq(feed_follows.user_id, user_id), eq(feed_follows.feed_id, feed.id)));
}