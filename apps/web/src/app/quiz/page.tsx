"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import {
  ContentContainer,
  Stack,
  Text,
  Button,
  Card,
  Banner,
  theme,
} from "@lurnt/ui";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const kgNodeId = searchParams.get("kgNode");
  const ueId = searchParams.get("ue");

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const quizQuery = trpc.nodeQuiz.getQuiz.useQuery(
    { knowledgeGraphNodeId: kgNodeId! },
    { enabled: !!kgNodeId },
  );

  const submitMutation = trpc.nodeQuiz.submitQuiz.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  if (!kgNodeId) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Banner variant="danger">Missing node ID.</Banner>
      </ContentContainer>
    );
  }

  if (quizQuery.isLoading) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Text>Loading quiz...</Text>
      </ContentContainer>
    );
  }

  if (quizQuery.error) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Banner variant="danger">{quizQuery.error.message}</Banner>
      </ContentContainer>
    );
  }

  if (!quizQuery.data) {
    return (
      <ContentContainer style={{ padding: "2rem 1rem" }}>
        <Text>No quiz available.</Text>
      </ContentContainer>
    );
  }

  const { quizId, nodeTitle, nodeDescription, questions, alreadyPassed } =
    quizQuery.data;

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  const handleSelect = (questionIndex: number, choiceIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: choiceIndex }));
  };

  const handleSubmit = () => {
    if (!allAnswered || submitMutation.isPending) return;
    const answers = questions.map(
      (_: { question: string; choices: string[] }, i: number) =>
        selectedAnswers[i],
    );
    submitMutation.mutate({
      knowledgeGraphNodeId: kgNodeId!,
      quizId,
      selectedAnswers: answers,
    });
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    submitMutation.reset();
  };

  const result = submitMutation.data;

  return (
    <ContentContainer
      style={{ padding: "2rem 1rem", maxWidth: 720, margin: "0 auto" }}
    >
      <Stack gap="1.5rem">
        <div>
          <Text variant="h2">{nodeTitle}</Text>
          {nodeDescription && (
            <Text
              style={{ color: theme.colors.textMuted, marginTop: "0.25rem" }}
            >
              {nodeDescription}
            </Text>
          )}
        </div>

        {alreadyPassed && !submitted && (
          <Banner variant="success">
            You've already passed this quiz! You can retake it for practice.
          </Banner>
        )}

        {/* Questions */}
        {questions.map(
          (q: { question: string; choices: string[] }, qIndex: number) => {
            const answer = result?.answers?.[qIndex];

            return (
              <Card key={qIndex} padding="md">
                <Stack gap="0.75rem">
                  <Text style={{ fontWeight: 600 }}>
                    {qIndex + 1}. {q.question}
                  </Text>
                  <Stack gap="0.5rem">
                    {q.choices.map((choice: string, cIndex: number) => {
                      const isSelected = selectedAnswers[qIndex] === cIndex;
                      const isCorrect = answer?.correct && isSelected;
                      const isWrong = answer && isSelected && !answer.correct;
                      const isCorrectAnswer =
                        submitted &&
                        result &&
                        !answer?.correct &&
                        result.answers[qIndex]?.selectedIndex !== cIndex &&
                        cIndex ===
                          questions[qIndex]?.choices.indexOf(
                            // We don't have correctIndex on client, show via answer feedback
                            choice,
                          );

                      let borderColor = theme.colors.border as string;
                      let bgColor = "transparent";
                      if (isSelected && !submitted) {
                        borderColor = theme.colors.primary;
                        bgColor = theme.colors.primary + "15";
                      }
                      if (isCorrect) {
                        borderColor = "#22c55e";
                        bgColor = "#22c55e15";
                      }
                      if (isWrong) {
                        borderColor = "#ef4444";
                        bgColor = "#ef444415";
                      }

                      return (
                        <div
                          key={cIndex}
                          onClick={() => handleSelect(qIndex, cIndex)}
                          style={{
                            padding: "0.75rem 1rem",
                            border: `2px solid ${borderColor}`,
                            borderRadius: "8px",
                            cursor: submitted ? "default" : "pointer",
                            background: bgColor,
                            transition: "all 0.15s",
                          }}
                        >
                          <Text>
                            <span style={{ fontWeight: 600, marginRight: 8 }}>
                              {String.fromCharCode(65 + cIndex)}.
                            </span>
                            {choice}
                          </Text>
                        </div>
                      );
                    })}
                  </Stack>
                  {submitted && answer && !answer.correct && (
                    <Text
                      variant="small"
                      style={{ color: "#ef4444", fontStyle: "italic" }}
                    >
                      Incorrect
                    </Text>
                  )}
                  {submitted && answer && answer.correct && (
                    <Text
                      variant="small"
                      style={{ color: "#22c55e", fontStyle: "italic" }}
                    >
                      Correct
                    </Text>
                  )}
                </Stack>
              </Card>
            );
          },
        )}

        {/* Error */}
        {submitMutation.error && (
          <Banner variant="danger">{submitMutation.error.message}</Banner>
        )}

        {/* Actions */}
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitMutation.isPending}
            size="md"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : result ? (
          <Card padding="md">
            <Stack gap="0.75rem">
              <Text variant="h3" style={{ margin: 0 }}>
                {result.passed ? "Passed!" : "Not quite"}
              </Text>
              <Text>
                Score: {result.correctCount}/{result.totalQuestions} (
                {Math.round(result.score * 100)}%)
              </Text>
              {result.passed ? (
                <Text style={{ color: "#22c55e" }}>
                  Great work! This node is now complete.
                </Text>
              ) : (
                <Text style={{ color: theme.colors.textMuted }}>
                  You need 80% to pass. Review the material and try again.
                </Text>
              )}
              <Stack direction="row" gap="0.5rem">
                {!result.passed && (
                  <Button onClick={handleRetry} variant="neutral" size="md">
                    Retry
                  </Button>
                )}
                {ueId && (
                  <Button
                    onClick={() => router.push(`/graph?ue=${ueId}`)}
                    variant={result.passed ? "primary" : "neutral"}
                    size="md"
                  >
                    Back to Graph
                  </Button>
                )}
              </Stack>
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </ContentContainer>
  );
}

export default function QuizPage() {
  return (
    <Suspense>
      <QuizContent />
    </Suspense>
  );
}
