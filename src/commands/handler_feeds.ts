import { getFeedsPlusUsername } from "src/lib/db/queries/feeds";


export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
    const feeds = await getFeedsPlusUsername();
    if (feeds.length === 0) {
        throw new Error(`Error: No feeds registered in database`);
    }
    for (const feed of feeds) {
        console.log(`Feed: ${feed.feedname}, URL: ${feed.url}, Owner: ${feed.username}`);
    }
}