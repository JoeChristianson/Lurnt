"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ContentContainer, Stack, Text } from "@lurnt/ui";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const userExpertiseId = searchParams.get("ue");

  return (
    <ContentContainer style={{ padding: "2rem 1rem" }}>
      <Stack gap="1rem">
        <Text variant="h1">Initial Assessment</Text>
        <Text>
          This is where the conversational intake and placement test will live.
        </Text>
        {userExpertiseId && (
          <Text style={{ fontSize: "0.875rem", opacity: 0.6 }}>
            User Expertise: {userExpertiseId}
          </Text>
        )}
      </Stack>
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
