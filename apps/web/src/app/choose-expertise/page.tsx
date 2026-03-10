"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useToast } from "@/contexts/ToastContext";
import {
  ContentContainer,
  Stack,
  Text,
  Input,
  Button,
  Card,
  Banner,
  theme,
} from "@lurnt/ui";

interface ExpertiseResult {
  id: string;
  title: string;
  description: string | null;
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function ChooseExpertisePage() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const searchResults = trpc.expertise.search.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length >= 1 },
  );

  const chooseMutation = trpc.expertise.choose.useMutation({
    onSuccess: (result) => {
      toast.success("Expertise selected!");
      router.push(`/assessment?ue=${result.userExpertiseId}`);
    },
  });

  const handleSelect = (expertiseId: string) => {
    chooseMutation.mutate({ expertiseId });
  };

  const handleCreate = () => {
    if (query.trim().length === 0) return;
    chooseMutation.mutate({ title: query.trim() });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results: ExpertiseResult[] = searchResults.data ?? [];
  const hasExactMatch = results.some(
    (r: ExpertiseResult) => r.title.toLowerCase() === query.trim().toLowerCase(),
  );

  return (
    <ContentContainer style={{ maxWidth: "500px", padding: "2rem 1rem" }}>
      <Stack gap="1.5rem">
        <Stack gap="0.5rem">
          <Text variant="h1">What do you want to learn?</Text>
          <Text style={{ color: theme.colors.textMuted }}>
            Search for an existing expertise or create a new one.
          </Text>
        </Stack>

        <div ref={containerRef} style={{ position: "relative" }}>
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="e.g. Machine Learning, Guitar, Spanish..."
            maxLength={255}
          />

          {showResults && debouncedQuery.length >= 1 && (
            <Card
              padding="none"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                marginTop: "4px",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {searchResults.isLoading && (
                <Text style={{ padding: "0.75rem", color: theme.colors.textMuted }}>
                  Searching...
                </Text>
              )}

              {!searchResults.isLoading && results.map((expertise: ExpertiseResult) => (
                <Button
                  key={expertise.id}
                  variant="neutral"
                  onClick={() => handleSelect(expertise.id)}
                  disabled={chooseMutation.isPending}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 0,
                    borderBottom: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <Stack gap="0.125rem">
                    <Text style={{ fontWeight: 500 }}>{expertise.title}</Text>
                    {expertise.description && (
                      <Text style={{ color: theme.colors.textMuted, fontSize: "0.875rem" }}>
                        {expertise.description}
                      </Text>
                    )}
                  </Stack>
                </Button>
              ))}

              {!searchResults.isLoading && !hasExactMatch && query.trim().length > 0 && (
                <Button
                  variant="neutral"
                  onClick={handleCreate}
                  disabled={chooseMutation.isPending}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    borderRadius: 0,
                    color: theme.colors.primary,
                  }}
                >
                  + Create &ldquo;{query.trim()}&rdquo;
                </Button>
              )}
            </Card>
          )}
        </div>

        {chooseMutation.error && (
          <Banner variant="danger">{chooseMutation.error.message}</Banner>
        )}

        {chooseMutation.isPending && (
          <Text style={{ color: theme.colors.textMuted }}>
            Setting up your learning path...
          </Text>
        )}
      </Stack>
    </ContentContainer>
  );
}
