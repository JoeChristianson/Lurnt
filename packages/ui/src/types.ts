import type { CSSProperties, ReactNode } from "react";

// Common prop types
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

// Color utilities
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

export type Size = "sm" | "md" | "lg";
