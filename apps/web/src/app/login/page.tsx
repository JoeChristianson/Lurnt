"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { theme } from "@lurnt/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const loginMutation = trpc.user.login.useMutation({
    onSuccess: (data) => {
      login(data.token);
      toast.success("Signed in successfully");
      router.push("/");
    },
  });

  const googleLoginMutation = trpc.user.loginWithGoogle.useMutation({
    onSuccess: (data) => {
      login(data.token);
      toast.success("Signed in successfully");
      if (data.needsHandle) {
        router.push("/choose-handle");
      } else {
        router.push("/");
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              fontSize: "1rem",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              fontSize: "1rem",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm,
            }}
          />
        </div>
        {loginMutation.error && (
          <div style={{ color: theme.colors.danger, marginBottom: "1rem" }}>
            Error: {loginMutation.error.message}
          </div>
        )}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "1rem",
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
            border: "none",
            borderRadius: theme.radii.sm,
            cursor: "pointer",
          }}
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
      <div
        style={{
          margin: "1.5rem 0",
          textAlign: "center",
          color: theme.colors.textMuted,
          fontSize: "0.85rem",
        }}
      >
        or
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              googleLoginMutation.mutate({
                credential: credentialResponse.credential,
              });
            }
          }}
          onError={() => {}}
        />
      </div>
      {googleLoginMutation.error && (
        <div
          style={{
            color: theme.colors.danger,
            marginTop: "0.5rem",
            textAlign: "center",
          }}
        >
          {googleLoginMutation.error.message}
        </div>
      )}
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
