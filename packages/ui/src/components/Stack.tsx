import type { CSSProperties, ReactNode } from "react";

export interface StackProps {
  direction?: "column" | "row";
  gap?: string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  children: ReactNode;
  style?: CSSProperties;
}

export function Stack({
  direction = "column",
  gap = "0",
  align,
  justify,
  children,
  style,
}: StackProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        gap,
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
