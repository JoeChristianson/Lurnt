import type { AuthedContext, CreateItemInput } from "@lurnt/domain";
import { withTx, validateItemTitle } from "@lurnt/domain";
import { createId } from "@paralleldrive/cuid2";
import { createItem, findItemById } from "@lurnt/data-access";

export async function create(ctx: AuthedContext, input: CreateItemInput) {
  validateItemTitle(input.title);

  const id = createId();

  return withTx(ctx, async (txCtx) => {
    await createItem(txCtx, {
      id,
      title: input.title,
      description: input.description ?? "",
      userId: ctx.user.userId,
    });

    return findItemById(txCtx, id);
  });
}
