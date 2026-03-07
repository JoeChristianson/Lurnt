"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { trpc } from "@/lib/trpc/client";

interface SocialLinks {
  twitter?: string;
  instagram?: string;
  bluesky?: string;
  mastodon?: string;
}

interface User {
  id: string;
  email: string;
  handle: string | null;
  emailVerified: number;
  termsAcceptedAt: string | null;
  bio: string | null;
  websiteUrl: string | null;
  socialLinks: SocialLinks | null;
  theme: string | null;
  isAdmin: number;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  needsHandle: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const {
    data: user,
    isLoading,
    refetch,
  } = trpc.user.me.useQuery(undefined, {
    enabled: Boolean(token),
    retry: false,
  });

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    refetch();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value: AuthContextType = {
    token,
    user: user || null,
    isAuthenticated: Boolean(token) && Boolean(user),
    isEmailVerified: Boolean(user?.emailVerified),
    isLoading: Boolean(token) && isLoading,
    needsHandle: Boolean(token) && Boolean(user) && !user?.handle,
    isAdmin: Boolean(user?.isAdmin),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
