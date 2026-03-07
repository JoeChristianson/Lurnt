import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

export interface PanelProps {
  children: ReactNode;
  position?: "left" | "right" | "bottom";
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}

export function Panel({
  children,
  position = "right",
  width = 320,
  height,
  style,
}: PanelProps) {
  const positionStyles: Record<string, CSSProperties> = {
    left: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: typeof width === "number" ? `${width}px` : width,
    },
    right: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: typeof width === "number" ? `${width}px` : width,
    },
    bottom: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: typeof height === "number" ? `${height}px` : height ?? "200px",
    },
  };

  const panelStyle: CSSProperties = {
    ...positionStyles[position],
    backgroundColor: theme.colors.panelBg,
    color: theme.colors.panelText,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    ...style,
  };

  return <div style={panelStyle}>{children}</div>;
}

export interface PanelHeaderProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function PanelHeader({ children, style }: PanelHeaderProps) {
  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        borderBottom: `1px solid ${theme.colors.panelBorderLight}`,
        fontWeight: 600,
        fontSize: "0.875rem",
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface PanelContentProps {
  children: ReactNode;
  style?: CSSProperties;
}

export function PanelContent({ children, style }: PanelContentProps) {
  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        padding: "0.75rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
