import type { CSSProperties, SelectHTMLAttributes } from "react";
import type { Size } from "../types";
import { theme } from "../theme";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  selectSize?: Size;
  fullWidth?: boolean;
}

const sizeStyles: Record<Size, CSSProperties> = {
  sm: { padding: "0.25rem 0.5rem", fontSize: "0.875rem" },
  md: { padding: "0.5rem 0.75rem", fontSize: "1rem" },
  lg: { padding: "0.75rem 1rem", fontSize: "1.125rem" },
};

export function Select({
  label,
  options,
  error,
  selectSize = "md",
  fullWidth = true,
  style,
  ...props
}: SelectProps) {
  const selectStyle: CSSProperties = {
    ...sizeStyles[selectSize],
    width: fullWidth ? "100%" : "auto",
    border: `1px solid ${error ? theme.colors.danger : theme.colors.neutralBorder}`,
    borderRadius: theme.radii.sm,
    boxSizing: "border-box",
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    cursor: "pointer",
    ...style,
  };

  const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: theme.colors.text,
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={labelStyle}>{label}</label>}
      <select style={selectStyle} {...props}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: theme.colors.danger }}>
          {error}
        </div>
      )}
    </div>
  );
}
