import type { EmailService, SendEmailInput, SendResult } from "../types";

interface SesConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  from: string;
}

export function createSesAdapter(config: SesConfig): EmailService {
  return {
    async send(input: SendEmailInput): Promise<SendResult> {
      try {
        const { SESv2Client, SendEmailCommand } = await import(
          "@aws-sdk/client-sesv2"
        );

        const client = new SESv2Client({
          region: config.region,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        });

        const command = new SendEmailCommand({
          FromEmailAddress: input.from ?? config.from,
          Destination: { ToAddresses: [input.to] },
          Content: {
            Simple: {
              Subject: { Data: input.subject },
              Body: { Html: { Data: input.html } },
            },
          },
        });

        const result = await client.send(command);
        return { success: true, messageId: result.MessageId };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
  };
}
