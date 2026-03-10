"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { DEFAULT_THEME, THEME_IDS } from "@lurnt/ui";
import type { ThemeId } from "@lurnt/ui";

const STORAGE_KEY = "erz-theme";

function isValidTheme(value: string | null): value is ThemeId {
  return Boolean(value) && THEME_IDS.includes(value as ThemeId);
}

function applyTheme(themeId: ThemeId) {
  document.documentElement.setAttribute("data-theme", themeId);
}

interface ThemeContextType {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [themeId, setThemeIdState] = useState<ThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isValidTheme(stored)) {
      setThemeIdState(stored);
    }
  }, []);

  useEffect(() => {
    if (user?.theme && isValidTheme(user.theme)) {
      setThemeIdState(user.theme);
      localStorage.setItem(STORAGE_KEY, user.theme);
    }
  }, [user?.theme]);

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  const setTheme = (id: ThemeId) => {
    setThemeIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
