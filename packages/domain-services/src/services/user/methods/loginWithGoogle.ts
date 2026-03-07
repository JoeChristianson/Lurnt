import { withTx } from "@lurnt/domain";
import type { UnauthedContext } from "@lurnt/domain";
import { createId } from "@paralleldrive/cuid2";
import {
  findUserByGoogleId,
  findUserByEmail,
  createOAuthUser,
  linkGoogleId,
} from "@lurnt/data-access";

export interface GooglePayload {
  googleId: string;
  email: string;
  name?: string | null;
  picture?: string | null;
}

export async function loginWithGoogle(
  ctx: UnauthedContext,
  input: {
    payload: GooglePayload;
    generateToken: (userId: string) => string;
  },
) {
  return withTx(ctx, async (txCtx) => {
    // 1. Look up by googleId first (returning user)
    const existingByGoogleId = await findUserByGoogleId(
      txCtx,
      input.payload.googleId,
    );
    if (existingByGoogleId) {
      const token = input.generateToken(existingByGoogleId.id);
      return {
        token,
        needsHandle: !existingByGoogleId.handle,
        isNewUser: false,
      };
    }

    // 2. Look up by email (auto-link existing email/password account)
    const existingByEmail = await findUserByEmail(
      txCtx,
      input.payload.email,
    );
    if (existingByEmail) {
      await linkGoogleId(txCtx, existingByEmail.id, input.payload.googleId);
      const token = input.generateToken(existingByEmail.id);
      return {
        token,
        needsHandle: !existingByEmail.handle,
        isNewUser: false,
      };
    }

    // 3. Brand new user — create with no handle, no password
    const userId = createId();
    await createOAuthUser(txCtx, {
      id: userId,
      email: input.payload.email,
      googleId: input.payload.googleId,
    });

    const token = input.generateToken(userId);
    return {
      token,
      needsHandle: true,
      isNewUser: true,
    };
  });
}
