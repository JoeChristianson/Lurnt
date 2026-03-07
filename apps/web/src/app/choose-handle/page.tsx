"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useToast } from "@/contexts/ToastContext";
import { theme } from "@lurnt/ui";

export default function ChooseHandlePage() {
  const [handle, setHandle] = useState("");
  const router = useRouter();
  const utils = trpc.useUtils();
  const { toast } = useToast();

  const setHandleMutation = trpc.user.setHandle.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
      toast.success("Welcome!");
      router.push("/");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (handle.length < 3) return;
    setHandleMutation.mutate({ handle });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h1>Choose Your Handle</h1>
      <p style={{ color: theme.colors.textMuted, marginBottom: "1.5rem" }}>
        Pick a unique username to get started.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="handle" style={{ display: "block", marginBottom: "0.5rem" }}>Handle</label>
          <input
            id="handle"
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
            minLength={3}
            maxLength={255}
            placeholder="your-handle"
            style={{ width: "100%", padding: "0.6rem 0.75rem", fontSize: "1rem", border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.sm }}
          />
        </div>
        {setHandleMutation.error && (
          <div style={{ color: theme.colors.danger, marginBottom: "1rem" }}>{setHandleMutation.error.message}</div>
        )}
        <button
          type="submit"
          disabled={setHandleMutation.isPending || handle.length < 3}
          style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", backgroundColor: theme.colors.primary, color: theme.colors.onPrimary, border: "none", borderRadius: theme.radii.sm, cursor: "pointer" }}
        >
          {setHandleMutation.isPending ? "Setting handle..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
