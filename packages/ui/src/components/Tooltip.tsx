import { useState, type CSSProperties, type ReactNode } from "react";
import { theme } from "../theme";

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionStyles: Record<string, CSSProperties> = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: "8px",
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: "8px",
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: "8px",
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: "8px",
    },
  };

  const tooltipStyle: CSSProperties = {
    position: "absolute",
    ...positionStyles[position],
    backgroundColor: theme.colors.tooltipBg,
    color: theme.colors.panelText,
    padding: "0.5rem 0.75rem",
    borderRadius: theme.radii.sm,
    fontSize: "0.75rem",
    whiteSpace: "nowrap",
    zIndex: 1000,
    pointerEvents: "none",
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && <div style={tooltipStyle}>{content}</div>}
    </div>
  );
}
