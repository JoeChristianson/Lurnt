import type { CSSProperties } from "react";
import type { ColorVariant } from "../types";
import { theme } from "../theme";

export interface ToastProps {
  message: string;
  variant?: ColorVariant;
  onClose: () => void;
}

const variantStyles: Record<ColorVariant, CSSProperties> = {
  primary: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.onPrimary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.onSecondary,
  },
  success: {
    backgroundColor: theme.colors.success,
    color: theme.colors.onSuccess,
  },
  warning: {
    backgroundColor: theme.colors.warning,
    color: theme.colors.onWarning,
  },
  danger: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.onDanger,
  },
  neutral: {
    backgroundColor: theme.colors.neutral,
    color: theme.colors.onNeutral,
  },
};

export function Toast({ message, variant = "success", onClose }: ToastProps) {
  const style: CSSProperties = {
    ...variantStyles[variant],
    padding: "0.75rem 2.25rem 0.75rem 1rem",
    borderRadius: theme.radii.md,
    boxShadow: theme.shadows.card,
    fontSize: "0.9rem",
    position: "relative",
    minWidth: "200px",
    maxWidth: "360px",
  };

  const closeBtnStyle: CSSProperties = {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    background: "none",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "1rem",
    lineHeight: 1,
    padding: "0 0.25rem",
    opacity: 0.7,
  };

  return (
    <div style={style}>
      {message}
      <button style={closeBtnStyle} onClick={onClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
}
