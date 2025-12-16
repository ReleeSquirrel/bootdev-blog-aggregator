import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from "drizzle-orm";

export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string, url: string, user_id: string): Promise<Feed> {
    const [result] = await db.insert(feeds)
        .values({ name: name, url: url, user_id: user_id }).returning();
    return result;
}

export async function getFeedsPlusUsername(): Promise<{ feedname: string; url: string; username: string; }[]> {
    const result = (await db.select({ feedname: feeds.name, url: feeds.url, username: users.name}).from(feeds).innerJoin(users, eq(feeds.user_id, users.id)));
    return result;
}