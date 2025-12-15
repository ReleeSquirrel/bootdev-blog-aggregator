import { resetUsers } from "../lib/db/queries/users";


export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
    const result = await resetUsers();
    console.log("Database table users has been reset.");
}