import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { fetchFeed } from "../lib/rss/fetch_feed";
import { createPost } from "src/lib/db/queries/posts";
import { DateTime } from "luxon";

/**
 * Handles the agg command in the cli, which sets the application into an unresponsive mode
 * gathering RSS data from the followed RSS feeds
 * @param cmdName 
 * @param args 
 */
export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error("Error: agg expects a duration to wait between requests.");
    }
    const time_between_reqs = parseDuration(args[0]);
    console.log(`Collecting feeds every ${time_between_reqs}ms.`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, time_between_reqs);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });

}

/**
 * Error handler callback for the scrapeFeeds interval loop
 * @param reason 
 */
function handleError(reason: any) {
    console.log(`Error: ${reason}`);
}

/**
 * Helper function to parse the user's duration input data
 * @param durationStr 
 * @returns 
 */
function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error(`Error: ${durationStr} — use format 1h 30m 15s or 3500ms`);
    }
    const time = Number.parseInt(match[1]);
    const unit = match[2];
    if (!['ms', 's', 'm', 'h'].includes(unit)) {
        throw new Error(`Error: Duration input is invalid.`);
    }
    let miliseconds: number;
    switch (unit) {
        case 'ms':
            miliseconds = time;
            break;
        case 's':
            miliseconds = time * 1000;
            break;
        case 'm':
            miliseconds = time * 60 * 1000;
            break;
        case 'h':
            miliseconds = time * 60 * 60 * 1000;
            break;
        default:
            throw new Error(`Error: parseDuration failed, unit didn't match filter.`);
    }
    return miliseconds;
}

/**
 * Scrape the data from the RSS feed in the database with the oldest last_fetched_from date
 */
export async function scrapeFeeds(): Promise<void> {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        throw new Error(`Error: No feeds registered.`);
    }
    await markFeedFetched(nextFeed.id);
    const RSSFeed = await fetchFeed(nextFeed.url);
    if (!RSSFeed) {
        throw new Error(`Error: No RSS Feed Recieved from ${nextFeed.url}.`);
    }
    for (const RSSItem of RSSFeed.channel.item) {
        // Parse the pubDate from the RSS feed which is in RFC 822 format into a JavaScript Date object for Database Insertion
        const parsedPubDate = DateTime.fromRFC2822(RSSItem.pubDate, { setZone : true });
        createPost(RSSItem.title, RSSItem.link, RSSItem.description, !parsedPubDate.isValid ? new Date() : parsedPubDate.toJSDate(), nextFeed.id);
    }
}