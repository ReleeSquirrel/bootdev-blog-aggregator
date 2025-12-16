import { readConfig } from "src/config";
import { getUser, User } from "src/lib/db/queries/users";

export type CommandHandler = (
    cmdName: string,
    ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export type MiddlewareLoggedIn = (
    handler: UserCommandHandler
) => CommandHandler;

export type CommandsRegistry = Record<string, CommandHandler>;

export async function middlewareLoggedIn(handler: UserCommandHandler) {
    return async (cmdName: string, ...args: string[]) => {
        const currentUserName = readConfig().currentUserName;
        if (!currentUserName) {
            throw new Error("Error: currentUserName not set in config file.");
        }
        const [currentUser] = await getUser(currentUserName);
        if (!currentUser) {
            throw new Error(`Error: No record for current user exists in users database. Create record for user ${currentUserName} first.`);
        }
        await handler(cmdName, currentUser, ...args);
    };
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    await registry[cmdName](cmdName, ...args);
}