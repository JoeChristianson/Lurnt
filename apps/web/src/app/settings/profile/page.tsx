"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton, Card, Stack, Text, Input, Textarea, Button, Banner } from "@lurnt/ui";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const [bio, setBio] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [bluesky, setBluesky] = useState("");
  const [mastodon, setMastodon] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setBio(user.bio ?? "");
      setWebsiteUrl(user.websiteUrl ?? "");
      setTwitter(user.socialLinks?.twitter ?? "");
      setInstagram(user.socialLinks?.instagram ?? "");
      setBluesky(user.socialLinks?.bluesky ?? "");
      setMastodon(user.socialLinks?.mastodon ?? "");
    }
  }, [user]);

  const mutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
      setSuccessMsg("Profile updated successfully.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    mutation.mutate({
      bio: bio || null,
      websiteUrl: websiteUrl || null,
      socialLinks: {
        twitter: twitter || undefined,
        instagram: instagram || undefined,
        bluesky: bluesky || undefined,
        mastodon: mastodon || undefined,
      },
    });
  };

  return (
    <Stack align="center" style={{ padding: "2rem" }}>
      <Card style={{ maxWidth: "600px", width: "100%" }} padding="lg">
        <BackButton onClick={() => router.back()} style={{ marginBottom: "0.75rem" }} />
        <Text variant="h1">Edit Profile</Text>

        {successMsg && <Banner variant="success">{successMsg}</Banner>}

        <form onSubmit={handleSubmit}>
          <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} placeholder="Tell people about yourself..." rows={4} />
          <Input label="Website" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yoursite.com" />

          <Text variant="h3" style={{ marginTop: "0.5rem" }}>Social Links</Text>

          <Input label="Twitter / X" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/yourhandle" />
          <Input label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="https://instagram.com/yourhandle" />
          <Input label="Bluesky" value={bluesky} onChange={(e) => setBluesky(e.target.value)} placeholder="https://bsky.app/profile/you" />
          <Input label="Mastodon" value={mastodon} onChange={(e) => setMastodon(e.target.value)} placeholder="https://mastodon.social/@you" />

          {mutation.error && <Banner variant="danger">{mutation.error.message}</Banner>}

          <Button type="submit" variant="primary" fullWidth disabled={mutation.isPending} style={{ marginTop: "0.5rem" }}>
            {mutation.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Card>
    </Stack>
  );
}
