import { resetUsers } from "../lib/db/queries/users";


export async function handlerReset(cmdName: string): Promise<void> {
    const result = await resetUsers();
    console.log("Database has been reset.");
}