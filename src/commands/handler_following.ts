import { readConfig } from "src/config";
import { getFeedFollowsForUser } from "src/lib/db/queries/feedfollows";


export async function handlerFollowing(cmdName: string, ...args: string[]): Promise<void> {
    const currentUserName = readConfig().currentUserName;
    if (!currentUserName) {
        throw new Error(`Error: No current user set in config file.`)
    }
    const feedFollows = await getFeedFollowsForUser(currentUserName);
    if (!feedFollows) {
        console.log(`Error: User ${currentUserName} is not following any feeds.`);
        return;
    }
    
    console.log(`User ${currentUserName} is currently following:`);
    for (const feedFollow of feedFollows) {
        console.log(`* ${feedFollow.feed_name}`);
    }
}