"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, ContentContainer, Stack, Text, Card, theme } from "@lurnt/ui";
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

  const { data: expertises } = trpc.expertise.myExpertises.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (
      isAuthenticated &&
      !authLoading &&
      expertiseStatus &&
      !expertiseStatus.hasActive
    ) {
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

        <Text>Welcome to Lurnt. Your guided path to expertise.</Text>

        {!isAuthenticated && (
          <Stack direction="row" gap="0.75rem">
            <Button variant="primary" onClick={() => router.push("/register")}>
              Get Started
            </Button>
            <Button variant="neutral" onClick={() => router.push("/login")}>
              Log in
            </Button>
          </Stack>
        )}

        {isAuthenticated && expertises && expertises.length > 0 && (
          <Stack gap="1rem">
            <Text variant="h2" style={{ marginBottom: 0 }}>
              Your Expertises
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {expertises.map((exp) => (
                <Card
                  key={exp.id}
                  padding="md"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/graph?ue=${exp.id}`)}
                >
                  <Stack gap="0.5rem">
                    <Text variant="h3" style={{ margin: 0 }}>
                      {exp.title}
                    </Text>
                    {exp.description && (
                      <Text
                        variant="small"
                        style={{ color: theme.colors.textMuted }}
                      >
                        {exp.description}
                      </Text>
                    )}
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/graph?ue=${exp.id}`);
                      }}
                    >
                      View Graph
                    </Button>
                  </Stack>
                </Card>
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </ContentContainer>
  );
}
