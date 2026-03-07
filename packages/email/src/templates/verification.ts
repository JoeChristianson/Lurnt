export interface VerificationEmailParams {
  handle: string;
  verificationUrl: string;
}

export function verificationEmail(params: VerificationEmailParams) {
  return {
    subject: "Verify your Zannal account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome to Zannal, ${params.handle}</h2>
        <p>Click the link below to verify your email address:</p>
        <p>
          <a href="${params.verificationUrl}"
             style="display:inline-block;padding:12px 24px;
                    background:#000;color:#fff;text-decoration:none;
                    border-radius:4px;">
            Verify Email
          </a>
        </p>
        <p style="color:#666;font-size:0.85rem;">
          If you did not create an account, you can ignore this email.
          This link expires in 24 hours.
        </p>
      </div>
    `,
  };
}
