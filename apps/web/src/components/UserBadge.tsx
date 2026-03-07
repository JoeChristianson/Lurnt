"use client";

import { useState, useCallback } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { theme, useClickOutside } from "@lurnt/ui";

const badgeStyle: CSSProperties = {
  position: "fixed",
  top: "0.6rem",
  right: "0.75rem",
  zIndex: 50,
  fontSize: "0.8rem",
  color: theme.colors.textMuted,
  backgroundColor: theme.colors.cardBg,
  border: `1px solid ${theme.colors.borderLight}`,
  borderRadius: theme.radii.md,
  padding: "0.25rem 0.6rem",
  textDecoration: "none",
  cursor: "pointer",
};

const menuStyle: CSSProperties = {
  position: "fixed",
  top: "2.2rem",
  right: "0.75rem",
  zIndex: 51,
  backgroundColor: theme.colors.cardBg,
  border: `1px solid ${theme.colors.borderLight}`,
  borderRadius: theme.radii.md,
  boxShadow: theme.shadows.card,
  minWidth: "140px",
  overflow: "hidden",
};

const menuItemStyle: CSSProperties = {
  display: "block",
  padding: "0.5rem 0.75rem",
  fontSize: "0.8rem",
  color: theme.colors.text,
  textDecoration: "none",
  borderBottom: `1px solid ${theme.colors.borderLight}`,
};

export function UserBadge() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(
    useCallback(() => setOpen(false), []),
  );

  if (!isAuthenticated || !user?.handle) {
    return null;
  }

  return (
    <div ref={menuRef as React.RefObject<HTMLDivElement>}>
      <div style={badgeStyle} onClick={() => setOpen((o) => !o)}>
        {user.handle}
      </div>
      {open && (
        <div style={menuStyle}>
          <Link
            href="/items"
            style={menuItemStyle}
            onClick={() => setOpen(false)}
          >
            Items
          </Link>
          <Link
            href="/settings"
            style={menuItemStyle}
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
          <div
            style={{
              ...menuItemStyle,
              cursor: "pointer",
              borderBottom: "none",
            }}
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            Log out
          </div>
        </div>
      )}
    </div>
  );
}
