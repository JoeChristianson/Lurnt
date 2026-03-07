import crypto from "crypto";
import type { UnauthedContext } from "@lurnt/domain";
import { setEmailVerificationToken } from "@lurnt/data-access";
import type { EmailService } from "@lurnt/email";
import { verificationEmail } from "@lurnt/email";

const TOKEN_EXPIRY_HOURS = 24;

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function getTokenExpiryDate(): Date {
  return new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
}

function getVerificationUrl(token: string): string {
  const baseUrl = process.env.APP_URL || "http://localhost:3000";
  return `${baseUrl}/verify-email?token=${token}`;
}

export async function sendVerificationEmail(
  ctx: UnauthedContext,
  input: {
    userId: string;
    email: string;
    handle: string;
    emailService: EmailService;
  },
) {
  const token = generateVerificationToken();
  const expiresAt = getTokenExpiryDate();

  await setEmailVerificationToken(ctx, input.userId, token, expiresAt);

  const verificationUrl = getVerificationUrl(token);
  const result = await input.emailService.send({
    to: input.email,
    ...verificationEmail({ handle: input.handle, verificationUrl }),
  });

  if (!result.success) {
    console.error("Failed to send verification email:", result.error);
  }

  return result;
}
