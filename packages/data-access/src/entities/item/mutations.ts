import { items } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function createItem(
  ctx: ServiceContext,
  data: {
    id: string;
    title: string;
    description: string;
    userId: string;
  },
) {
  await ctx.db.client.insert(items).values(data);
}

export async function updateItem(
  ctx: ServiceContext,
  itemId: string,
  data: Partial<{
    title: string;
    description: string;
  }>,
) {
  await ctx.db.client.update(items).set(data).where(eq(items.id, itemId));
}

export async function deleteItem(ctx: ServiceContext, itemId: string) {
  await ctx.db.client.delete(items).where(eq(items.id, itemId));
}
