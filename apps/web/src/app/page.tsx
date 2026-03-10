"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, ContentContainer, Stack, Text } from "@lurnt/ui";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggler } from "@/components/ThemeToggler";
import { trpc } from "@/lib/trpc/client";

export default function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { data: expertiseStatus } = trpc.expertise.hasActive.useQuery(
    undefined,
    { enabled: isAuthenticated },
  );

  useEffect(() => {
    if (isAuthenticated && !authLoading && expertiseStatus && !expertiseStatus.hasActive) {
      router.push("/choose-expertise");
    }
  }, [isAuthenticated, authLoading, expertiseStatus, router]);

  return (
    <ContentContainer style={{ padding: "2rem 1rem" }}>
      <Stack gap="1.5rem">
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          style={{ flexWrap: "wrap", gap: "1rem" }}
        >
          <Text variant="h1" style={{ marginBottom: 0 }}>
            Lurnt
          </Text>
          <Stack direction="row" gap="0.75rem" align="center">
            <ThemeToggler />
            {!isAuthenticated && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
            )}
          </Stack>
        </Stack>

        <Text>
          Welcome to Lurnt. Your guided path to expertise.
        </Text>

        {!isAuthenticated && (
          <Stack direction="row" gap="0.75rem">
            <Button
              variant="primary"
              onClick={() => router.push("/register")}
            >
              Get Started
            </Button>
            <Button variant="neutral" onClick={() => router.push("/login")}>
              Log in
            </Button>
          </Stack>
        )}
      </Stack>
    </ContentContainer>
  );
}
