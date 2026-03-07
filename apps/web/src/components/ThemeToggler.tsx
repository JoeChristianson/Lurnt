"use client";

import { theme, THEME_IDS, THEME_NAMES } from "@lurnt/ui";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggler() {
  const { themeId, setTheme } = useTheme();

  const currentIndex = THEME_IDS.indexOf(themeId);

  function cycle() {
    const next = THEME_IDS[(currentIndex + 1) % THEME_IDS.length];
    setTheme(next);
  }

  return (
    <button
      onClick={cycle}
      title={`Theme: ${THEME_NAMES[themeId]}`}
      style={{
        background: "none",
        border: `1px solid ${theme.colors.borderLight}`,
        borderRadius: theme.radii.sm,
        padding: "0.35rem 0.65rem",
        cursor: "pointer",
        fontSize: "0.8rem",
        color: theme.colors.textMuted,
        transition: "border-color 0.15s ease, color 0.15s ease",
      }}
    >
      {THEME_NAMES[themeId]}
    </button>
  );
}
