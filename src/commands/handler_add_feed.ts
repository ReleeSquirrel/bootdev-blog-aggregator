import { createFeedFollow } from "src/lib/db/queries/feedfollows";
import { readConfig } from "../config";
import { createFeed, Feed } from "../lib/db/queries/feeds";
import { getUser, User } from "../lib/db/queries/users";


export async function handlerAddFeed(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error("Error: addfeed expects a feed name and url.");
    }
    const currentUserName = readConfig().currentUserName;
    if (!currentUserName) {
        throw new Error("Error: currentUserName not set in config file.");
    }
    const [currentUser] = await getUser(currentUserName);
    if (!currentUser) {
        throw new Error(`Error: No record for current user exists in users database. Create record for user ${currentUserName} first.`);
    }
    const feed = await createFeed(args[0], args[1], currentUser.id);
    const feedFollow = await createFeedFollow(currentUser.id, feed.id);
    console.log(`New feed ${feedFollow.feed_name} added by user ${feedFollow.user_name}. User automatically following new feed.`);
}
