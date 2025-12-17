import { readConfig } from "../config";
import { getUsers } from "../lib/db/queries/users";

/**
 * Handles the users command in the cli, presenting a list of all registered users
 * @param cmdName 
 */
export async function handlerUsers(cmdName: string): Promise<void> {
    const userList = await getUsers();
    for (const user of userList) {
        console.log(`* ${user.name}${user.name === readConfig().currentUserName ? " (current)" : ""}`);
    }
}