"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { theme } from "@lurnt/ui";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const registerMutation = trpc.user.register.useMutation({
    onSuccess: (data) => {
      login(data.token);
      toast.success("Account created!");
      router.push("/choose-expertise");
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
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }
    if (handle.length < 3) {
      setValidationError("Handle must be at least 3 characters");
      return;
    }

    registerMutation.mutate({ email, handle, password });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "0.6rem 0.75rem", fontSize: "1rem", border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.sm }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="handle" style={{ display: "block", marginBottom: "0.5rem" }}>Handle (username)</label>
          <input id="handle" type="text" value={handle} onChange={(e) => setHandle(e.target.value)} required minLength={3} style={{ width: "100%", padding: "0.6rem 0.75rem", fontSize: "1rem", border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.sm }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={{ width: "100%", padding: "0.6rem 0.75rem", fontSize: "1rem", border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.sm }} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.5rem" }}>Confirm Password</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} style={{ width: "100%", padding: "0.6rem 0.75rem", fontSize: "1rem", border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.sm }} />
        </div>
        {validationError && <div style={{ color: theme.colors.danger, marginBottom: "1rem" }}>{validationError}</div>}
        {registerMutation.error && <div style={{ color: theme.colors.danger, marginBottom: "1rem" }}>Error: {registerMutation.error.message}</div>}
        <button type="submit" disabled={registerMutation.isPending} style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", backgroundColor: theme.colors.success, color: theme.colors.onSuccess, border: "none", borderRadius: theme.radii.sm, cursor: "pointer" }}>
          {registerMutation.isPending ? "Registering..." : "Register"}
        </button>
      </form>
      <div style={{ margin: "1.5rem 0", textAlign: "center", color: theme.colors.textMuted, fontSize: "0.85rem" }}>or</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              googleLoginMutation.mutate({ credential: credentialResponse.credential });
            }
          }}
          onError={() => {}}
        />
      </div>
      {googleLoginMutation.error && <div style={{ color: theme.colors.danger, marginTop: "0.5rem", textAlign: "center" }}>{googleLoginMutation.error.message}</div>}
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
