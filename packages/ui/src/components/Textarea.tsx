import type { CSSProperties, TextareaHTMLAttributes } from "react";
import type { Size } from "../types";
import { theme } from "../theme";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  inputSize?: Size;
  fullWidth?: boolean;
}

const sizeStyles: Record<Size, CSSProperties> = {
  sm: { padding: "0.25rem 0.5rem", fontSize: "0.875rem" },
  md: { padding: "0.5rem 0.75rem", fontSize: "1rem" },
  lg: { padding: "0.75rem 1rem", fontSize: "1.125rem" },
};

export function Textarea({
  label,
  error,
  inputSize = "md",
  fullWidth = true,
  style,
  ...props
}: TextareaProps) {
  const textareaStyle: CSSProperties = {
    ...sizeStyles[inputSize],
    width: fullWidth ? "100%" : "auto",
    border: `1px solid ${error ? theme.colors.danger : theme.colors.neutralBorder}`,
    borderRadius: theme.radii.sm,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s ease",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "80px",
    ...style,
  };

  const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: theme.colors.text,
  };

  const errorStyle: CSSProperties = {
    marginTop: "0.25rem",
    fontSize: "0.75rem",
    color: theme.colors.danger,
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea style={textareaStyle} {...props} />
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}
