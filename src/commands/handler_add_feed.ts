import { createFeedFollow } from "src/lib/db/queries/feedfollows";
import { createFeed } from "../lib/db/queries/feeds";
import { User } from "../lib/db/queries/users";


export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
    if (args.length < 2) {
        throw new Error("Error: addfeed expects a feed name and url.");
    }
    
    const feed = await createFeed(args[0], args[1], user.id);
    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`New feed ${feedFollow.feed_name} added by user ${feedFollow.user_name}. User automatically following new feed.`);
}
