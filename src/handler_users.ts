import { readConfig } from "./config";
import { getUsers } from "./lib/db/queries/users";


export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
    const userList = await getUsers();
    for (const user of userList) {
        console.log(`* ${user.name}${user.name === readConfig().currentUserName ? " (current)" : ""}`);
    }
}