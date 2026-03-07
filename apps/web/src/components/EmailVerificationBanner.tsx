"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/contexts/AuthContext";
import { Banner, Button } from "@lurnt/ui";

const COOLDOWN_SECONDS = 60;

export function EmailVerificationBanner() {
  const { user, isEmailVerified } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const utils = trpc.useUtils();

  const resendMutation = trpc.user.resendVerification.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      setCooldown(COOLDOWN_SECONDS);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  if (!user || isEmailVerified) return null;

  return (
    <Banner variant="warning">
      Please verify your email address. Check your inbox for a verification
      link.{" "}
      <Button
        variant="neutral"
        size="sm"
        disabled={cooldown > 0 || resendMutation.isPending}
        onClick={() => resendMutation.mutate()}
        style={{ marginLeft: "0.5rem" }}
      >
        {resendMutation.isPending
          ? "Sending..."
          : cooldown > 0
            ? `Resend (${cooldown}s)`
            : "Resend"}
      </Button>
    </Banner>
  );
}
