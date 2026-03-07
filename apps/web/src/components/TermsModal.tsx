"use client";

import { Modal, Button, theme } from "@lurnt/ui";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/contexts/AuthContext";
import type { CSSProperties } from "react";

const contentStyle: CSSProperties = {
  maxHeight: "60vh",
  overflow: "auto",
  marginBottom: "1.5rem",
  lineHeight: 1.6,
  fontSize: "0.95rem",
  color: theme.colors.text,
};

export function TermsModal() {
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const acceptMutation = trpc.user.acceptTerms.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
    },
  });

  if (!user || user.termsAcceptedAt) return null;

  return (
    <Modal title="Terms of Use" closeable={false}>
      <div style={contentStyle}>
        <p style={{ marginBottom: "1rem" }}>
          <strong>1. Your account.</strong> You are responsible for your account
          credentials and all activity under your handle.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>2. Acceptable use.</strong> You agree not to use this platform
          to post content that is illegal, harassing, or violates others&apos;
          rights.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>3. Limitation of liability.</strong> This platform is provided
          as-is. We make no guarantees about uptime, data preservation, or
          availability.
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>4. Privacy.</strong> We collect your email address and handle.
          We do not sell your personal information.
        </p>
        <p>
          <strong>5. Changes.</strong> These terms may be changed at any time.
          Continued use constitutes acceptance.
        </p>
      </div>
      <Button
        variant="primary"
        fullWidth
        onClick={() => acceptMutation.mutate()}
        disabled={acceptMutation.isPending}
      >
        {acceptMutation.isPending ? "Accepting..." : "I Accept"}
      </Button>
    </Modal>
  );
}
