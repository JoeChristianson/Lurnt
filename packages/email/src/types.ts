export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailService {
  send(input: SendEmailInput): Promise<SendResult>;
}

export interface EmailConfig {
  provider: "resend" | "mailgun" | "ses";
  from: string;
  resendApiKey?: string;
  mailgunApiKey?: string;
  mailgunDomain?: string;
  sesRegion?: string;
  sesAccessKeyId?: string;
  sesSecretAccessKey?: string;
}
