import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { theme } from "../theme";

export interface ModalProps {
  children: ReactNode;
  title?: string;
  onClose?: () => void;
  closeable?: boolean;
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 300,
};

const modalStyle: CSSProperties = {
  backgroundColor: theme.colors.background,
  borderRadius: theme.radii.md,
  boxShadow: theme.shadows.card,
  width: "min(480px, 100vw)",
  maxHeight: "100dvh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const mobileQuery = "@media (max-width: 600px)";

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 1.25rem",
  borderBottom: `1px solid ${theme.colors.borderLight}`,
  flexShrink: 0,
};

const closeStyle: CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1.3rem",
  color: theme.colors.textMuted,
  padding: "0.5rem",
  lineHeight: 1,
};

const bodyStyle: CSSProperties = {
  padding: "1.25rem",
  flex: 1,
  overflow: "auto",
};

export function Modal({ children, title, onClose, closeable = true }: ModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div style={overlayStyle} onClick={closeable ? onClose : undefined}>
      <div
        className="erz-modal"
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={headerStyle}>
            <span style={{ fontWeight: 600, fontSize: "1rem" }}>{title}</span>
            {closeable && (
              <button style={closeStyle} onClick={onClose}>
                &times;
              </button>
            )}
          </div>
        )}
        <div style={bodyStyle}>{children}</div>
      </div>
      <style>{`
        ${mobileQuery} {
          .erz-modal {
            width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
