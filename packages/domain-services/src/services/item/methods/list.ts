import type { AuthedContext, ListItemsInput } from "@lurnt/domain";
import { listItems, listItemsByUserId } from "@lurnt/data-access";

export async function list(ctx: AuthedContext, input: ListItemsInput = {}) {
  if (input.userId) {
    return listItemsByUserId(ctx, input.userId);
  }
  return listItemsByUserId(ctx, ctx.user.userId);
}
