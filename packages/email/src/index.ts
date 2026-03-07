export { createEmailService } from "./factory";
export type {
  EmailService,
  EmailConfig,
  SendEmailInput,
  SendResult,
} from "./types";
export { verificationEmail } from "./templates/verification";
export type { VerificationEmailParams } from "./templates/verification";
