import { z } from "zod";
import { QuizQuestionSchema, type QuizQuestion } from "@lurnt/domain";
import { getAnthropicClient } from "../client";

const QuizResponseSchema = z.object({
  questions: z.array(QuizQuestionSchema),
});

const SYSTEM_PROMPT = `You are an expert educator creating a multiple-choice quiz to assess a student's understanding of a specific topic.

Return ONLY raw valid JSON with no markdown formatting, no code fences, no explanation. Match this exact schema:

{
  "questions": [
    {
      "question": "Clear question text",
      "choices": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    }
  ]
}

Guidelines:
- Generate exactly 5 questions
- Each question must have exactly 4 choices
- correctIndex is 0-based (0 = first choice)
- Questions should range from basic recall to applied understanding
- Make distractors plausible but clearly wrong to someone who knows the material
- Avoid trick questions or ambiguous wording
- Cover different aspects of the topic`;

export async function generateQuizQuestions(
  nodeTitle: string,
  nodeDescription: string | null,
): Promise<QuizQuestion[]> {
  const client = getAnthropicClient();

  const userMessage = `Topic: ${nodeTitle}${nodeDescription ? `\nDescription: ${nodeDescription}` : ""}

Generate a 5-question multiple-choice quiz for this topic.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const rawText = textBlock?.text ?? "{}";
  const rawJson = rawText
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(rawJson);
  const result = QuizResponseSchema.parse(parsed);
  return result.questions;
}
