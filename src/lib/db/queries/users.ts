import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

/**
 * A type matching the schema of the users table in the database
 */
export type User = typeof users.$inferSelect;

/**
 * Creates a new entry in the users table for a named user
 * @param name The name of the user to create
 * @returns A copy of the user data from the table
 */
export async function createUser(name: string): Promise<User> {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

/**
 * Gets a record of the named user from the users table in the database
 * @param name The name of the user to get
 * @returns An array of User objects containing the query results
 */
export async function getUser(name: string): Promise<User[]> {
  const result = await db.select().from(users).where(eq(users.name, name));
  return result;
}

/**
 * Gets all records from the users table
 * @returns An array of User objects containing the query results
 */
export async function getUsers(): Promise<User[]> {
  const result = await db.select().from(users);
  return result;
}

/**
 * Deletes all records in the users table, causing a cascade that deletes all records in the database
 */
export async function resetUsers(): Promise<void> {
  await db.delete(users);
}