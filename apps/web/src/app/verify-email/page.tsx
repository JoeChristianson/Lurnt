"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button, Card, Text, Stack, theme } from "@lurnt/ui";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const utils = trpc.useUtils();

  const verifyMutation = trpc.user.verifyEmail.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
    },
  });

  useEffect(() => {
    if (token && !verifyMutation.isSuccess && !verifyMutation.isError) {
      verifyMutation.mutate({ token });
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack align="center" style={{ padding: "2rem" }}>
      <Card style={{ maxWidth: "400px", width: "100%" }} padding="lg">
        <Stack align="center" gap="1rem">
          <Text variant="h1" align="center">
            Email Verification
          </Text>

          {!token && (
            <Text color={theme.colors.danger}>
              No verification token provided.
            </Text>
          )}

          {verifyMutation.isPending && (
            <Text variant="muted">Verifying your email...</Text>
          )}

          {verifyMutation.isSuccess && (
            <Stack align="center" gap="1rem">
              <Text color={theme.colors.success}>
                Your email has been verified.
              </Text>
              <Button variant="primary" onClick={() => router.push("/")}>
                Continue
              </Button>
            </Stack>
          )}

          {verifyMutation.isError && (
            <Text color={theme.colors.danger}>
              {verifyMutation.error.message}
            </Text>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Stack align="center" style={{ padding: "2rem" }}>
          <Card style={{ maxWidth: "400px", width: "100%" }} padding="lg">
            <Stack align="center" gap="1rem">
              <Text variant="h1" align="center">
                Email Verification
              </Text>
              <Text variant="muted">Loading...</Text>
            </Stack>
          </Card>
        </Stack>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
