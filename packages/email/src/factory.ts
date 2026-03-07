import type { EmailConfig, EmailService } from "./types";
import { createResendAdapter } from "./adapters/resend";
import { createMailgunAdapter } from "./adapters/mailgun";
import { createSesAdapter } from "./adapters/ses";

export function createEmailService(
  config?: Partial<EmailConfig>,
): EmailService {
  const provider =
    config?.provider ??
    (process.env.EMAIL_PROVIDER as EmailConfig["provider"]) ??
    "resend";

  const from = config?.from ?? process.env.EMAIL_FROM ?? "no-reply@zannal.com";

  switch (provider) {
    case "resend":
      return createResendAdapter({
        apiKey: config?.resendApiKey ?? process.env.RESEND_API_KEY ?? "",
        from,
      });
    case "mailgun":
      return createMailgunAdapter({
        apiKey: config?.mailgunApiKey ?? process.env.MAILGUN_API_KEY ?? "",
        domain: config?.mailgunDomain ?? process.env.MAILGUN_DOMAIN ?? "",
        from,
      });
    case "ses":
      return createSesAdapter({
        region: config?.sesRegion ?? process.env.AWS_SES_REGION ?? "us-east-1",
        accessKeyId:
          config?.sesAccessKeyId ?? process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey:
          config?.sesSecretAccessKey ?? process.env.AWS_SECRET_ACCESS_KEY ?? "",
        from,
      });
    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}
