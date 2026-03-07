import type { AuthedContext } from "@lurnt/domain";
import { findUserById } from "@lurnt/data-access";
import type { EmailService } from "@lurnt/email";
import { sendVerificationEmail } from "./sendVerificationEmail";

export async function resendVerification(
  ctx: AuthedContext,
  input: { emailService: EmailService },
) {
  const user = await findUserById(ctx, ctx.user.userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    return { success: true, alreadyVerified: true };
  }

  await sendVerificationEmail(
    { _type: "unauthed", db: ctx.db },
    {
      userId: user.id,
      email: user.email,
      handle: user.handle,
      emailService: input.emailService,
    },
  );

  return { success: true, alreadyVerified: false };
}
