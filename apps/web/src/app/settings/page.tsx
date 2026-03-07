"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useTheme } from "@/contexts/ThemeContext";
import {
  BackButton,
  Card,
  Stack,
  Text,
  Banner,
  THEME_IDS,
  THEME_NAMES,
  DEFAULT_THEME,
  theme,
} from "@lurnt/ui";
import type { ThemeId } from "@lurnt/ui";

const THEME_PREVIEWS: Record<
  ThemeId,
  { bg: string; accent: string; card: string }
> = {
  "warm-literary": { bg: "#f5f0e8", accent: "#3d5a80", card: "#faf7f2" },
  "ink-paper": { bg: "#f5f5f0", accent: "#c0392b", card: "#ffffff" },
  "dark-moody": { bg: "#121416", accent: "#d4a843", card: "#1e2126" },
  "earth-tones": { bg: "#f0ebe2", accent: "#8b6f47", card: "#f8f5f0" },
};

export default function SettingsPage() {
  const router = useRouter();
  const { themeId, setTheme: setLocalTheme } = useTheme();
  const [successMsg, setSuccessMsg] = useState("");

  const mutation = trpc.user.updateTheme.useMutation({
    onSuccess: () => {
      setSuccessMsg("Theme saved.");
    },
  });

  const handleSelect = (id: ThemeId) => {
    setLocalTheme(id);
    setSuccessMsg("");
    mutation.mutate({ theme: id });
  };

  return (
    <Stack align="center" style={{ padding: "2rem" }}>
      <Card style={{ maxWidth: "600px", width: "100%" }} padding="lg">
        <BackButton onClick={() => router.back()} style={{ marginBottom: "0.75rem" }} />
        <Text variant="h1">Settings</Text>

        {successMsg && <Banner variant="success">{successMsg}</Banner>}
        {mutation.error && <Banner variant="danger">{mutation.error.message}</Banner>}

        <Text variant="h3" style={{ marginTop: "0.5rem" }}>Theme</Text>
        <Text variant="muted" style={{ marginBottom: "1rem" }}>Choose how the app looks for you.</Text>

        <Stack gap="0.75rem">
          {THEME_IDS.map((id) => {
            const preview = THEME_PREVIEWS[id];
            const isSelected = id === themeId;
            return (
              <Card
                key={id}
                padding="none"
                style={{
                  cursor: "pointer",
                  outline: isSelected
                    ? `2px solid ${theme.colors.primary}`
                    : `1px solid ${theme.colors.borderLight}`,
                  overflow: "hidden",
                }}
                onClick={() => handleSelect(id)}
              >
                <Stack direction="row" style={{ height: "4rem" }}>
                  <Stack direction="row" style={{ width: "5rem", flexShrink: 0 }}>
                    <Stack style={{ flex: 1, backgroundColor: preview.bg }}>{""}</Stack>
                    <Stack style={{ flex: 1, backgroundColor: preview.accent }}>{""}</Stack>
                    <Stack style={{ flex: 1, backgroundColor: preview.card }}>{""}</Stack>
                  </Stack>
                  <Stack justify="center" style={{ padding: "0 1rem", flex: 1 }}>
                    <Text variant="body" style={{ fontWeight: isSelected ? 700 : 500, marginBottom: 0 }}>
                      {THEME_NAMES[id]}
                    </Text>
                    {id === DEFAULT_THEME && (
                      <Text variant="muted" style={{ fontSize: "0.75rem", marginBottom: 0 }}>Default</Text>
                    )}
                  </Stack>
                  {isSelected && (
                    <Stack align="center" justify="center" style={{ width: "3rem", flexShrink: 0, fontSize: "1.25rem" }}>
                      {"\u2713"}
                    </Stack>
                  )}
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Card>
    </Stack>
  );
}
