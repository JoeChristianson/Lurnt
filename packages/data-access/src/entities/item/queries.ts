import { items } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findItemById(ctx: ServiceContext, itemId: string) {
  const result = await ctx.db.client
    .select()
    .from(items)
    .where(eq(items.id, itemId))
    .limit(1);
  return result[0] ?? null;
}

export async function listItems(ctx: ServiceContext) {
  return ctx.db.client
    .select()
    .from(items)
    .orderBy(items.createdAt);
}

export async function listItemsByUserId(ctx: ServiceContext, userId: string) {
  return ctx.db.client
    .select()
    .from(items)
    .where(eq(items.userId, userId))
    .orderBy(items.createdAt);
}
