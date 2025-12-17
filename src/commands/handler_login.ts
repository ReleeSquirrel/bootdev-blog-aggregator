import { setUser } from "../config";
import { getUser } from "../lib/db/queries/users";

/**
 * Handles the login command in the cli, which switches the current user
 * @param cmdName 
 * @param args 
 */
export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error("Error: login expects a user name.");
    }
    if ((await getUser(args[0])).length === 0) {
        throw new Error("Error: User name not found.");
    }

    setUser(args[0]);
    console.log(`User ${args[0]} logged in.`);
}