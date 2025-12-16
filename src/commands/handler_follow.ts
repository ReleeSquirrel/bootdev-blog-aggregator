import { readConfig } from "src/config";
import { createFeedFollow } from "src/lib/db/queries/feedfollows";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";


export async function handlerFollow(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error("Error: Follow expects a url.");
    }
    const feed = await getFeedByUrl(args[0]);
    if (!feed) {
        throw new Error(`Error: No record of a feed with url ${args[0]} found in database.`);
    }
    const currentUserName = readConfig().currentUserName;
    if (!currentUserName) {
        throw new Error(`Error: No current user set in config file.`)
    }
    const [currentUser] = await getUser(currentUserName);
    if (!currentUser) {
        throw new Error(`Error: No user with the username ${currentUserName} found in database.`);
    }
    const result = await createFeedFollow(currentUser.id, feed.id);
    console.log(`User ${result.user_name} is now following ${result.feed_name}.`);
}