import type { AuthedContext, UpdateItemInput } from "@lurnt/domain";
import { validateItemTitle } from "@lurnt/domain";
import { findItemById, updateItem } from "@lurnt/data-access";

export async function update(ctx: AuthedContext, input: UpdateItemInput) {
  const existing = await findItemById(ctx, input.id);
  if (!existing) {
    throw new Error("Item not found");
  }
  if (existing.userId !== ctx.user.userId) {
    throw new Error("Not authorized to update this item");
  }

  if (input.title !== undefined) {
    validateItemTitle(input.title);
  }

  const data: Partial<{ title: string; description: string }> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;

  await updateItem(ctx, input.id, data);
  return findItemById(ctx, input.id);
}
