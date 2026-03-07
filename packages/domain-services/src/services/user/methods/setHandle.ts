import { withTx } from "@lurnt/domain";
import type { UnauthedContext } from "@lurnt/domain";
import { findUserByHandle, setUserHandle } from "@lurnt/data-access";

export async function setHandle(
  ctx: UnauthedContext,
  input: { userId: string; handle: string },
) {
  return withTx(ctx, async (txCtx) => {
    const existing = await findUserByHandle(txCtx, input.handle);
    if (existing) {
      throw new Error("Handle already taken");
    }

    await setUserHandle(txCtx, input.userId, input.handle);

    return { success: true, handle: input.handle };
  });
}
