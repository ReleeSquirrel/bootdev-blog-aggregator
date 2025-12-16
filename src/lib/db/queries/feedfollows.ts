import { db } from "..";
import { feed_follows, feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { getUser } from "./users";

export type FeedFollow = typeof feed_follows.$inferSelect;

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