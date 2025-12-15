import { setUser } from "./config.js";


export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length === 0) {
        throw new Error("login expects a user name");
    }

    setUser(args[0]);
    console.log("User has been set.");
}