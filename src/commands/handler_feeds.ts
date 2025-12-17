import { getFeedsPlusUsername } from "src/lib/db/queries/feeds";

/**
 * Handles the feeds command in the cli, which gives a list of registered feeds
 * @param cmdName 
 */
export async function handlerFeeds(cmdName: string): Promise<void> {
    const feeds = await getFeedsPlusUsername();
    if (feeds.length === 0) {
        throw new Error(`Error: No feeds registered in database.`);
    }
    for (const feed of feeds) {
        console.log(`Feed: ${feed.feedname}, URL: ${feed.url}, Owner: ${feed.username}`);
    }
}