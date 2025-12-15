import { fetchFeed } from "./fetch_feed";
import { inspect } from "util";


export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
    const result = await fetchFeed("https://www.wagslane.dev/index.xml");
    console.log(inspect(result, false, null, true));
}