import { withTx } from "@lurnt/domain";
import type { UnauthedContext } from "@lurnt/domain";
import {
  findUserByVerificationToken,
  markEmailVerified,
} from "@lurnt/data-access";

export async function verifyEmail(
  ctx: UnauthedContext,
  input: { token: string },
) {
  return withTx(ctx, async (txCtx) => {
    const user = await findUserByVerificationToken(txCtx, input.token);

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    if (user.emailVerified) {
      return { success: true, alreadyVerified: true };
    }

    await markEmailVerified(txCtx, user.id);

    return { success: true, alreadyVerified: false };
  });
}
