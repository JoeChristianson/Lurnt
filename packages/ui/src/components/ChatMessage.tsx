import type { CSSProperties } from "react";
import { theme } from "../theme";

export interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  style?: CSSProperties;
}

export function ChatMessage({ role, content, style }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "0.75rem 1rem",
          borderRadius: theme.radii.md,
          backgroundColor: isUser ? theme.colors.primary : theme.colors.cardBg,
          color: isUser ? theme.colors.onPrimary : theme.colors.text,
          boxShadow: theme.shadows.card,
          whiteSpace: "pre-wrap",
          lineHeight: 1.5,
        }}
      >
        {content}
      </div>
    </div>
  );
}
