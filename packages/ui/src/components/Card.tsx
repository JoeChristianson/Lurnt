import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

export interface CardProps {
  children: ReactNode;
  title?: string;
  padding?: "none" | "sm" | "md" | "lg";
  style?: CSSProperties;
  onClick?: () => void;
}

const paddingMap = {
  none: "0",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
};

export function Card({ children, title, padding = "md", style, onClick }: CardProps) {
  const cardStyle: CSSProperties = {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radii.md,
    boxShadow: theme.shadows.card,
    overflow: "hidden",
    ...style,
  };

  const headerStyle: CSSProperties = {
    padding: "0.75rem 1rem",
    borderBottom: `1px solid ${theme.colors.borderLight}`,
    fontWeight: 600,
    fontSize: "0.875rem",
    color: theme.colors.text,
  };

  const contentStyle: CSSProperties = {
    padding: paddingMap[padding],
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {title && <div style={headerStyle}>{title}</div>}
      <div style={contentStyle}>{children}</div>
    </div>
  );
}

export interface CardHeaderProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        borderBottom: `1px solid ${theme.colors.borderLight}`,
        fontWeight: 600,
        fontSize: "0.875rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface CardContentProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function CardContent({ children, style }: CardContentProps) {
  return <div style={{ padding: "1rem", ...style }}>{children}</div>;
}
