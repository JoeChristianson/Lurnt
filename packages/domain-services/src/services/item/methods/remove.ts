import type { AuthedContext } from "@lurnt/domain";
import { findItemById, deleteItem } from "@lurnt/data-access";

export async function remove(ctx: AuthedContext, input: { id: string }) {
  const existing = await findItemById(ctx, input.id);
  if (!existing) {
    throw new Error("Item not found");
  }
  if (existing.userId !== ctx.user.userId) {
    throw new Error("Not authorized to delete this item");
  }

  await deleteItem(ctx, input.id);
  return { success: true };
}
