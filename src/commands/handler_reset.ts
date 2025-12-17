import { resetUsers } from "../lib/db/queries/users";

/**
 * Handles the reset command in the cli, which resets the database
 * @param cmdName 
 */
export async function handlerReset(cmdName: string): Promise<void> {
    const result = await resetUsers();
    console.log("Database has been reset.");
}