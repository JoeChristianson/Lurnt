import { Resend } from "resend";
import type { EmailService, SendEmailInput, SendResult } from "../types";

interface ResendConfig {
  apiKey: string;
  from: string;
}

export function createResendAdapter(config: ResendConfig): EmailService {
  const resend = new Resend(config.apiKey);

  return {
    async send(input: SendEmailInput): Promise<SendResult> {
      try {
        const { data, error } = await resend.emails.send({
          from: input.from ?? config.from,
          to: input.to,
          subject: input.subject,
          html: input.html,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true, messageId: data?.id };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
  };
}
