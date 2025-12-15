import { setUser } from "../config";
import { getUser } from "../lib/db/queries/users";


export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error("Error: login expects a user name");
    }
    if ((await getUser(args[0])).length === 0) {
        throw new Error("Error: user name not found");
    }

    setUser(args[0]);
    console.log("User has been set.");
}