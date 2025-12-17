import { url } from "node:inspector";
import { deleteFeedFollowByUserIdAndFeedUrl } from "src/lib/db/queries/feedfollows";
import { User } from "src/lib/db/queries/users";

/**
 * Handles the unfollow command in the cli, removing a feed follow record of the current user with the given url
 * @param cmdName 
 * @param user the current user
 * @param args 
 */
export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length < 1) {
        throw new Error("Error: unfollow expects a url.");
    }
    await deleteFeedFollowByUserIdAndFeedUrl(user.id, args[0]);
    console.log(`User ${user.name} is no longer following ${args[0]}.`);
}