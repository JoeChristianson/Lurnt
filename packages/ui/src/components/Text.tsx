import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

type TextVariant = "h1" | "h2" | "h3" | "body" | "small" | "muted";

export interface TextProps {
  variant?: TextVariant;
  color?: string;
  align?: CSSProperties["textAlign"];
  children: ReactNode;
  style?: CSSProperties;
}

const variantStyles: Record<TextVariant, CSSProperties> = {
  h1: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: theme.colors.textDark,
    marginBottom: "1rem",
  },
  h2: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: theme.colors.textDark,
    marginBottom: "0.75rem",
  },
  h3: {
    fontSize: "1rem",
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: "0.5rem",
  },
  body: {
    fontSize: "1rem",
    color: theme.colors.text,
    lineHeight: 1.5,
  },
  small: {
    fontSize: "0.875rem",
    color: theme.colors.text,
    lineHeight: 1.4,
  },
  muted: {
    fontSize: "0.875rem",
    color: theme.colors.textMuted,
    lineHeight: 1.4,
  },
};

const elementMap: Record<TextVariant, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  small: "p",
  muted: "p",
};

export function Text({
  variant = "body",
  color,
  align,
  children,
  style,
}: TextProps) {
  const Tag = elementMap[variant];

  return (
    <Tag
      style={{
        ...variantStyles[variant],
        ...(color ? { color } : {}),
        ...(align ? { textAlign: align } : {}),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
