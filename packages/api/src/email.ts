import { createEmailService } from "@lurnt/email";

let _emailService: ReturnType<typeof createEmailService> | null = null;

export function getEmailService() {
  if (!_emailService) {
    _emailService = createEmailService();
  }
  return _emailService;
}
