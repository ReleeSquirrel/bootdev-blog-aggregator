import { getPostsForUser } from "src/lib/db/queries/posts";
import { User } from "src/lib/db/queries/users";

/**
 * Handles the browse command in the cli, which shows the contents of RSS feeds the current user is following
 * @param cmdName 
 * @param user 
 * @param args 
 */
export async function handlerBrowse(cmdName: string, user: User, ...args: string[]): Promise<void> {
    let postLimit;
    if(args) {
        postLimit = Number(args[0]);
    }

    const posts = await getPostsForUser(user.id, !postLimit ? 2 : postLimit);

    for (const post of posts) {
        console.log(`Title: ${post.title}`);
        console.log(`URL: ${post.url}`);
        console.log(`Description: ${post.description}`);
        console.log(`Published At: ${post.publishedAt}`);
        console.log(` ---`);
    }
}