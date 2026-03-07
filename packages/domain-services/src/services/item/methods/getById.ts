import type { AuthedContext } from "@lurnt/domain";
import { findItemById } from "@lurnt/data-access";

export async function getById(ctx: AuthedContext, input: { id: string }) {
  const item = await findItemById(ctx, input.id);
  if (!item) {
    throw new Error("Item not found");
  }
  return item;
}
