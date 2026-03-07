"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { trpc } from "@/lib/trpc/client";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { UserBadge } from "@/components/UserBadge";
import { EmailVerificationBanner } from "@/components/EmailVerificationBanner";
import { TermsModal } from "@/components/TermsModal";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          headers() {
            const token = localStorage.getItem("token");
            const headers: Record<string, string> = {};
            if (token) {
              headers.authorization = `Bearer ${token}`;
            }
            return headers;
          },
        }),
      ],
    }),
  );

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider>
              <ToastProvider>
                <UserBadge />
                <EmailVerificationBanner />
                <TermsModal />
                {children}
              </ToastProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </GoogleOAuthProvider>
  );
}
