import type { AssessmentMessage, IntakeSummary } from "@lurnt/domain";
import { IntakeSummarySchema } from "@lurnt/domain";
import { getAnthropicClient } from "../client";

const SUMMARY_SYSTEM_PROMPT = `You are analyzing a conversation between a learning coach and a student about their knowledge of a subject. Based on the conversation, produce a JSON summary of the student's knowledge level.

Return ONLY raw valid JSON with no markdown formatting, no code fences, no explanation. Match this exact schema:
{
  "overallLevel": "beginner" | "intermediate" | "advanced",
  "familiarTopics": ["list of topics/subtopics the student knows well"],
  "gapAreas": ["list of topics/areas the student needs to learn"],
  "goals": "brief summary of what the student wants to achieve",
  "recommendedStartingPoint": "where to begin their learning path"
}`;

export async function generateIntakeSummary(
  messages: AssessmentMessage[],
  expertiseTitle: string,
): Promise<IntakeSummary> {
  const client = getAnthropicClient();

  const conversationText = messages
    .filter((m) => m.role !== "system")
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SUMMARY_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Subject: ${expertiseTitle}\n\nConversation:\n${conversationText}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const rawText = textBlock?.text ?? "{}";

  // Strip markdown code fences if the model wraps the JSON
  const rawJson = rawText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  const parsed = JSON.parse(rawJson);
  return IntakeSummarySchema.parse(parsed);
}
