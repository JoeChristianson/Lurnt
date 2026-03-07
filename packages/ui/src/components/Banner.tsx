import type { CSSProperties, ReactNode } from "react";
import type { ColorVariant } from "../types";
import { theme } from "../theme";

export interface BannerProps {
  variant?: ColorVariant;
  children: ReactNode;
  style?: CSSProperties;
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

export function Banner({
  variant = "warning",
  children,
  style,
}: BannerProps) {
  const baseStyle: CSSProperties = {
    ...variantStyles[variant],
    padding: "0.75rem 1rem",
    textAlign: "center",
    fontSize: "0.9rem",
    ...style,
  };

  return <div style={baseStyle}>{children}</div>;
}
