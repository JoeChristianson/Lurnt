import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from "react";
import type { ColorVariant, Size } from "../types";
import { theme } from "../theme";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ColorVariant, CSSProperties> = {
  primary: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.onPrimary,
    border: `1px solid ${theme.colors.primary}`,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.onSecondary,
    border: `1px solid ${theme.colors.secondary}`,
  },
  success: {
    backgroundColor: theme.colors.success,
    color: theme.colors.onSuccess,
    border: `1px solid ${theme.colors.success}`,
  },
  warning: {
    backgroundColor: theme.colors.warning,
    color: theme.colors.onWarning,
    border: `1px solid ${theme.colors.warning}`,
  },
  danger: {
    backgroundColor: theme.colors.danger,
    color: theme.colors.onDanger,
    border: `1px solid ${theme.colors.danger}`,
  },
  neutral: {
    backgroundColor: theme.colors.neutral,
    color: theme.colors.onNeutral,
    border: `1px solid ${theme.colors.neutralBorder}`,
  },
};

const sizeStyles: Record<Size, CSSProperties> = {
  sm: { padding: "0.25rem 0.5rem", fontSize: "0.875rem" },
  md: { padding: "0.5rem 1rem", fontSize: "1rem" },
  lg: { padding: "0.75rem 1.5rem", fontSize: "1.125rem" },
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled,
  style,
  children,
  ...props
}: ButtonProps) {
  const baseStyle: CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: theme.radii.sm,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? "100%" : "auto",
    fontWeight: 500,
    transition: "opacity 0.15s ease",
    ...style,
  };

  return (
    <button style={baseStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
