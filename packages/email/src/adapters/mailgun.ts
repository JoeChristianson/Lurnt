import type { EmailService, SendEmailInput, SendResult } from "../types";

interface MailgunConfig {
  apiKey: string;
  domain: string;
  from: string;
}

export function createMailgunAdapter(config: MailgunConfig): EmailService {
  const baseUrl = `https://api.mailgun.net/v3/${config.domain}/messages`;
  const authHeader =
    "Basic " + Buffer.from(`api:${config.apiKey}`).toString("base64");

  return {
    async send(input: SendEmailInput): Promise<SendResult> {
      try {
        const form = new URLSearchParams();
        form.append("from", input.from ?? config.from);
        form.append("to", input.to);
        form.append("subject", input.subject);
        form.append("html", input.html);

        const res = await fetch(baseUrl, {
          method: "POST",
          headers: { Authorization: authHeader },
          body: form,
        });

        if (!res.ok) {
          const text = await res.text();
          return { success: false, error: `Mailgun ${res.status}: ${text}` };
        }

        const data = (await res.json()) as { id?: string };
        return { success: true, messageId: data.id };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
  };
}
