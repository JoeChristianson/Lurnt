import type { CSSProperties } from "react";
import { theme } from "../theme";

export interface TypingIndicatorProps {
  style?: CSSProperties;
}

export function TypingIndicator({ style }: TypingIndicatorProps) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", ...style }}>
      <div
        style={{
          padding: "0.75rem 1rem",
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.cardBg,
          color: theme.colors.textMuted,
          boxShadow: theme.shadows.card,
        }}
      >
        Thinking...
      </div>
    </div>
  );
}
