import { fetchFeed } from "../lib/rss/fetch_feed";
import { inspect } from "util";


export async function handlerAgg(cmdName: string): Promise<void> {
    const result = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(inspect(result, false, null, true));
}