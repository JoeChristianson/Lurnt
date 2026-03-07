import { withTx } from "@lurnt/domain";
import type { UnauthedContext } from "@lurnt/domain";
import { upsertUser } from "@lurnt/data-access";
import { hashPassword } from "@lurnt/utils";
import { createId } from "@paralleldrive/cuid2";

export async function planter(
  ctx: UnauthedContext,
  input: {
    email: string;
    handle: string;
    password: string;
  },
) {
  return withTx(ctx, async (txCtx) => {
    const passwordHash = await hashPassword(input.password);

    return upsertUser(txCtx, {
      id: createId(),
      email: input.email,
      handle: input.handle,
      passwordHash,
    });
  });
}
