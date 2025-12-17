import { getFeedFollowsForUser } from "src/lib/db/queries/feedfollows";
import { User } from "src/lib/db/queries/users";

/**
 * Handles the following command in the cli, displayings a list of feeds followed by the given user
 * @param cmdName 
 * @param user 
 * @returns 
 */
export async function handlerFollowing(cmdName: string, user: User): Promise<void> {
    const feedFollows = await getFeedFollowsForUser(user.name);
    if (!feedFollows) {
        console.log(`Error: User ${user.name} is not following any feeds.`);
        return;
    }
    
    console.log(`User ${user.name} is currently following:`);
    for (const feedFollow of feedFollows) {
        console.log(`* ${feedFollow.feed_name}`);
    }
}