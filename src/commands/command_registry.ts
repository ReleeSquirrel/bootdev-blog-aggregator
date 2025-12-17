import { readConfig } from "src/config";
import { getUser, User } from "src/lib/db/queries/users";

/**
 * A function type defining the signature of a command handler function
 */
export type CommandHandler = (
    cmdName: string,
    ...args: string[]
) => Promise<void>;

/**
 * A function type defining the signature of a command handler function that takes user data
 */
export type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

/**
 * A function type defining the signature of a Middleware function that creates a CommandHandler function for a UserCommandHandler function
 */
export type MiddlewareLoggedIn = (
    handler: UserCommandHandler
) => CommandHandler;

/**
 * A type representing a Record<string, CommandHandler> utility type
 */
export type CommandsRegistry = Record<string, CommandHandler>;

/**
 * A middleware function to perform user authentication for UserCommandHandler functions
 * @param handler The handler function for the result function to call
 * @returns A CommandHandler function that calls a UserCommandHandler and provides current user data
 */
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

/**
 * Registers a command to the given CommandsRegistry
 * @param registry The CommandsRegistry to register the command to
 * @param cmdName The name of the command
 * @param handler The handler function to call
 */
export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
}

/**
 * Runs a command handler from the given CommandRegistry
 * @param registry The CommandRegistry to look up the command in
 * @param cmdName The name of the command
 * @param args Arguments for the command
 */
export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    await registry[cmdName](cmdName, ...args);
}