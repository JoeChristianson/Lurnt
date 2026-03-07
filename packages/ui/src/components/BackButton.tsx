import type { CSSProperties, ButtonHTMLAttributes } from "react";
import { theme } from "../theme";

export interface BackButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function BackButton({
  label = "Back",
  style,
  ...props
}: BackButtonProps) {
  const baseStyle: CSSProperties = {
    background: "none",
    border: "none",
    padding: "0.5rem 0",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontSize: "1rem",
    color: theme.colors.primary,
    ...style,
  };

  return (
    <button style={baseStyle} {...props}>
      <span style={{ fontSize: "1.1em", lineHeight: 1 }}>{"\u2190"}</span>
      {label}
    </button>
  );
}
