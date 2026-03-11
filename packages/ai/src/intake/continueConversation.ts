import type { AssessmentMessage } from "@lurnt/domain";
import { getAnthropicClient } from "../client";

const INTAKE_SYSTEM_PROMPT = `You are an expert learning coach conducting an intake conversation with a new learner. Your goal is to understand their existing knowledge, experience level, and learning goals for the subject they've chosen.

Guidelines:
- Be warm, encouraging, and conversational
- Ask one focused question at a time
- Explore: prior experience, formal/informal education, hands-on projects, specific subtopics they know, areas they find confusing, and their goals
- Adapt your questions based on their responses — go deeper where they show knowledge, don't belabor areas they're clearly unfamiliar with
- Keep the conversation to roughly 4-6 exchanges total
- When you have enough information to assess their level, end your message with the exact marker [INTAKE_COMPLETE] on its own line

The subject area is: {expertiseTitle}`;

export async function continueIntakeConversation(
  messages: AssessmentMessage[],
  expertiseTitle: string,
): Promise<{ content: string; isComplete: boolean }> {
  const client = getAnthropicClient();

  const systemPrompt = INTAKE_SYSTEM_PROMPT.replace(
    "{expertiseTitle}",
    expertiseTitle,
  );

  const anthropicMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages:
      anthropicMessages.length === 0
        ? [{ role: "user", content: "Hi, I just signed up and picked this subject. Can you help assess where I'm at?" }]
        : anthropicMessages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const rawContent = textBlock?.text ?? "";

  const isComplete = rawContent.includes("[INTAKE_COMPLETE]");
  const content = rawContent.replace(/\n?\[INTAKE_COMPLETE\]\n?/g, "").trim();

  return { content, isComplete };
}
