import type { CSSProperties, ReactNode } from "react";
import type { ColorVariant, Size } from "../types";
import { theme } from "../theme";

export interface BadgeProps {
  children: ReactNode;
  variant?: ColorVariant;
  size?: Size;
  style?: CSSProperties;
}

const variantStyles: Record<ColorVariant, CSSProperties> = {
  primary: { backgroundColor: theme.colors.primary, color: theme.colors.onPrimary },
  secondary: { backgroundColor: theme.colors.secondary, color: theme.colors.onSecondary },
  success: { backgroundColor: theme.colors.success, color: theme.colors.onSuccess },
  warning: { backgroundColor: theme.colors.warning, color: theme.colors.onWarning },
  danger: { backgroundColor: theme.colors.danger, color: theme.colors.onDanger },
  neutral: { backgroundColor: theme.colors.neutral, color: theme.colors.onNeutral },
};

const sizeStyles: Record<Size, CSSProperties> = {
  sm: { padding: "0.15rem 0.4rem", fontSize: "0.7rem" },
  md: { padding: "0.25rem 0.5rem", fontSize: "0.75rem" },
  lg: { padding: "0.35rem 0.65rem", fontSize: "0.875rem" },
};

export function Badge({
  children,
  variant = "primary",
  size = "md",
  style,
}: BadgeProps) {
  const badgeStyle: CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radii.sm,
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: "nowrap",
    ...style,
  };

  return <span style={badgeStyle}>{children}</span>;
}
