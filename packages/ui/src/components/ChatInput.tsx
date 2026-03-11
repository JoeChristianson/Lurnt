"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { theme } from "../theme";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Type your response...",
  disabled = false,
  style,
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", ...style }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        style={{
          flex: 1,
          padding: "0.5rem 0.75rem",
          fontSize: "1rem",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radii.sm,
          fontFamily: "inherit",
          resize: "none",
          outline: "none",
        }}
      />
    </div>
  );
}
