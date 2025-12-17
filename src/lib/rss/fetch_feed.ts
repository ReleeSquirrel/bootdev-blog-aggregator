import { XMLParser } from "fast-xml-parser";

/**
 * A type representing a simplified RSS Feed
 */
type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

/**
 * A type representing a simplified item property of an RSS feed
 */
type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

/**
 * Fetches the data from an RSS feed
 * @param feedURL The URL of the RSS feed to fetch
 * @returns An RSSFeed object containing the data from the RSS feed
 */
export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
            accept: "application/rss+xml",
        },
    });
    if (!response.ok) {
        throw new Error(`Error: failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }

    const responseText = await response.text();
    const xmlParser = new XMLParser();
    const responseXML = await xmlParser.parse(responseText);

    // Validation Block
    if (!responseXML.rss ||
        !responseXML.rss.channel ||
        !responseXML.rss.channel.title ||
        !responseXML.rss.channel.link ||
        !responseXML.rss.channel.description ||
        !responseXML.rss.channel.item
    ) {
        throw new Error(`Error: Bad XML recieved from url ${feedURL}`);
    }

    const items: any[] = Array.isArray(responseXML.rss.channel.item) 
    ? responseXML.rss.channel.item : [responseXML.rss.channel.item];

    const rssItems: RSSItem[] = [];

    for (const item of items) {
        // Validation
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue;
        }

        rssItems.push({
            "title": item.title,
            "link": item.link,
            "description": item.description,
            "pubDate": item.pubDate,
        });
    }

    const result: RSSFeed = {
        "channel": {
            "title": responseXML.rss.channel.title,
            "link": responseXML.rss.channel.link,
            "description": responseXML.rss.channel.description,
            "item": rssItems,
        }
    };

    return result;
}

