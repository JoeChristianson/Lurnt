import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

export interface ToolbarProps {
  children: ReactNode;
  position?: "top" | "bottom";
  right?: number;
  height?: number;
}

export function Toolbar({
  children,
  position = "bottom",
  right = 0,
  height = 52,
}: ToolbarProps) {
  const isBottom = position === "bottom";

  const style: CSSProperties = {
    position: "fixed",
    left: 0,
    right,
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    backgroundColor: theme.colors.background,
    zIndex: 100,
    transition: "right 0.2s ease",
    padding: ".8rem 1rem",
    ...(isBottom
      ? {
          bottom: 0,

          borderTop: `1px solid ${theme.colors.borderLight}`,
        }
      : {
          top: 0,
          height: `${height}px`,
          borderBottom: `1px solid ${theme.colors.borderLight}`,
        }),
  };

  return (
    <div className={isBottom ? "erz-toolbar" : undefined} style={style}>
      {children}
    </div>
  );
}
