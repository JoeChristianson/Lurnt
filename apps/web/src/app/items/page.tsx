"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banner,
  Button,
  Card,
  ContentContainer,
  Stack,
  Text,
  theme,
} from "@lurnt/ui";
import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/contexts/AuthContext";

export default function ItemsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const itemsQuery = trpc.items.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createMutation = trpc.items.create.useMutation({
    onSuccess: () => {
      utils.items.list.invalidate();
      setTitle("");
      setDescription("");
    },
  });

  const updateMutation = trpc.items.update.useMutation({
    onSuccess: () => {
      utils.items.list.invalidate();
      setEditingId(null);
    },
  });

  const deleteMutation = trpc.items.delete.useMutation({
    onSuccess: () => {
      utils.items.list.invalidate();
    },
  });

  if (!isAuthenticated) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Stack gap="1rem" align="center">
          <Text variant="h2">Please log in to manage items</Text>
          <Button variant="primary" onClick={() => router.push("/login")}>
            Log in
          </Button>
        </Stack>
      </ContentContainer>
    );
  }

  const items = itemsQuery.data ?? [];

  const inputStyle = {
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
    border: `1px solid ${theme.colors.borderLight}`,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.cardBg,
    color: theme.colors.text,
    width: "100%",
  };

  return (
    <ContentContainer style={{ padding: "2rem 1rem" }}>
      <Stack gap="1.5rem">
        <Text variant="h1">My Items</Text>

        {/* Create form */}
        <Card padding="md">
          <Stack gap="0.75rem">
            <Text variant="h3" style={{ marginBottom: 0 }}>
              New Item
            </Text>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={inputStyle}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                createMutation.mutate({ title, description })
              }
              disabled={!title.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Item"}
            </Button>
            {createMutation.error && (
              <Banner variant="danger">{createMutation.error.message}</Banner>
            )}
          </Stack>
        </Card>

        {/* Items list */}
        {itemsQuery.isLoading && <Text>Loading...</Text>}

        {itemsQuery.error && (
          <Banner variant="danger">Failed to load items.</Banner>
        )}

        {items.length === 0 && !itemsQuery.isLoading && (
          <Text style={{ color: theme.colors.textMuted }}>
            No items yet. Create your first one above!
          </Text>
        )}

        <Stack gap="0.75rem">
          {items.map((item: any) => (
            <Card key={item.id} padding="md">
              {editingId === item.id ? (
                <Stack gap="0.5rem">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={inputStyle}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={3}
                    style={inputStyle}
                  />
                  <Stack direction="row" gap="0.5rem">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        updateMutation.mutate({
                          id: item.id,
                          title: editTitle,
                          description: editDescription,
                        })
                      }
                      disabled={updateMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      variant="neutral"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack gap="0.5rem">
                  <Stack
                    direction="row"
                    justify="space-between"
                    align="center"
                  >
                    <Text
                      variant="h3"
                      style={{ marginBottom: 0 }}
                    >
                      {item.title}
                    </Text>
                    <Stack direction="row" gap="0.5rem">
                      <Button
                        variant="neutral"
                        size="sm"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditTitle(item.title);
                          setEditDescription(item.description ?? "");
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteMutation.mutate({ id: item.id })}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                  {item.description && (
                    <Text style={{ color: theme.colors.textMuted }}>
                      {item.description}
                    </Text>
                  )}
                </Stack>
              )}
            </Card>
          ))}
        </Stack>
      </Stack>
    </ContentContainer>
  );
}
