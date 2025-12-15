import { setUser } from "./config";
import { createUser, getUser } from "./lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error("Error: register expects a user name");
    }

    if ((await getUser(args[0])).length === 0) {
        const userData = await createUser(args[0]);
        setUser(args[0]);
        console.log(`user named ${args[0]} created.`);
        console.log(userData);
    } else {
        throw new Error(`Error: user name ${args[0]} already exists in database!`);
    }
}