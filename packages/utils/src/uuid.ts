import { randomUUID } from "crypto";

/**
 * Generates a UUID v4 string
 */
export function generateUUID(): string {
  return randomUUID();
}

/**
 * Generates a prefixed UUID for easier identification
 * @param prefix - Prefix to add (e.g., "game", "user", "action")
 */
export function generatePrefixedUUID(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}
