"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import {
  ContentContainer,
  Stack,
  Text,
  Button,
  Card,
  Banner,
  ChatMessage,
  ChatInput,
  TypingIndicator,
  theme,
} from "@lurnt/ui";
import type { AssessmentMessage } from "@lurnt/domain";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userExpertiseId = searchParams.get("ue");
  const [inputValue, setInputValue] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationQuery = trpc.assessment.getConversation.useQuery(
    { userExpertiseId: userExpertiseId! },
    { enabled: !!userExpertiseId },
  );

  const startMutation = trpc.assessment.startIntake.useMutation({
    onSuccess: () => {
      conversationQuery.refetch();
    },
  });

  const sendMutation = trpc.assessment.sendMessage.useMutation({
    onSuccess: (data) => {
      if (data.isComplete) {
        setIsComplete(true);
      }
      conversationQuery.refetch();
    },
  });

  const generateGraphMutation = trpc.knowledgeGraph.generate.useMutation({
    onSuccess: () => {
      router.push(`/graph?ue=${userExpertiseId}`);
    },
  });

  const completeMutation = trpc.assessment.completeIntake.useMutation({
    onSuccess: (data) => {
      generateGraphMutation.mutate({
        userExpertiseId: userExpertiseId!,
        summary: data.summary,
      });
    },
  });

  // Auto-start intake if no conversation exists
  useEffect(() => {
    if (
      userExpertiseId &&
      conversationQuery.data === null &&
      !conversationQuery.isLoading &&
      !startMutation.isPending &&
      !startMutation.isSuccess
    ) {
      startMutation.mutate({ userExpertiseId });
    }
  }, [
    userExpertiseId,
    conversationQuery.data,
    conversationQuery.isLoading,
    startMutation.isPending,
    startMutation.isSuccess,
  ]);

  // Check if already completed
  useEffect(() => {
    if (conversationQuery.data?.status === "completed") {
      setIsComplete(true);
    }
  }, [conversationQuery.data?.status]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationQuery.data?.conversation]);

  if (!userExpertiseId) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Banner variant="danger">
          Missing user expertise ID. Please go back and select an expertise.
        </Banner>
      </ContentContainer>
    );
  }

  const messages: AssessmentMessage[] =
    conversationQuery.data?.conversation ?? [];
  const isLoading =
    conversationQuery.isLoading ||
    startMutation.isPending ||
    sendMutation.isPending;
  const isCompleted = conversationQuery.data?.status === "completed";

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sendMutation.isPending) return;
    setInputValue("");
    sendMutation.mutate({
      userExpertiseId,
      message: trimmed,
    });
  };

  const handleComplete = () => {
    completeMutation.mutate({ userExpertiseId });
  };

  return (
    <ContentContainer
      style={{
        padding: "1rem",
        height: "calc(100vh - 4rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text variant="h2" style={{ marginBottom: "1rem", flexShrink: 0 }}>
        Initial Assessment
      </Text>

      {/* Messages area */}
      <Card
        padding="md"
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "1rem",
        }}
      >
        <Stack gap="0.75rem">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {(startMutation.isPending || sendMutation.isPending) && (
            <TypingIndicator />
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Card>

      {/* Error display */}
      {(startMutation.error ||
        sendMutation.error ||
        completeMutation.error ||
        generateGraphMutation.error) && (
        <Banner variant="danger" style={{ marginBottom: "0.5rem" }}>
          {startMutation.error?.message ||
            sendMutation.error?.message ||
            completeMutation.error?.message ||
            generateGraphMutation.error?.message}
        </Banner>
      )}

      {/* Input area */}
      {!isCompleted && (
        <Stack direction="row" gap="0.5rem" style={{ flexShrink: 0 }}>
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            placeholder={
              isComplete
                ? "Assessment ready to complete..."
                : "Type your response..."
            }
            disabled={isLoading || isCompleted}
            style={{ flex: 1 }}
          />
          {!isComplete ? (
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              size="md"
            >
              Send
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={completeMutation.isPending || generateGraphMutation.isPending}
              variant="success"
              size="md"
            >
              {completeMutation.isPending
                ? "Analyzing..."
                : generateGraphMutation.isPending
                  ? "Building graph..."
                  : "Finish"}
            </Button>
          )}
        </Stack>
      )}

      {/* Completed state */}
      {isCompleted && (
        <Card padding="md">
          <Stack gap="0.5rem">
            <Text style={{ fontWeight: 600 }}>Assessment Complete</Text>
            <Text style={{ color: theme.colors.textMuted }}>
              Your intake conversation has been analyzed.
            </Text>
            <Button
              onClick={() => router.push(`/graph?ue=${userExpertiseId}`)}
              size="md"
            >
              View Learning Path
            </Button>
          </Stack>
        </Card>
      )}
    </ContentContainer>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense>
      <AssessmentContent />
    </Suspense>
  );
}
