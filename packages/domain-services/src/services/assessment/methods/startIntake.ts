import type { AuthedContext } from "@lurnt/domain";
import { createId } from "@paralleldrive/cuid2";
import {
  findIntakeByUserExpertiseId,
  findUserExpertiseWithTitle,
  createExpertiseAssessmentResult,
  updateIntakeConversation,
} from "@lurnt/data-access";
import type { AssessmentMessage } from "@lurnt/domain";

export async function startIntake(
  ctx: AuthedContext,
  input: {
    userExpertiseId: string;
    continueIntakeConversation: (
      messages: AssessmentMessage[],
      expertiseTitle: string,
    ) => Promise<{ content: string; isComplete: boolean }>;
  },
) {
  const userExpertise = await findUserExpertiseWithTitle(
    ctx,
    input.userExpertiseId,
  );
  if (!userExpertise) {
    throw new Error("User expertise not found");
  }
  if (userExpertise.userId !== ctx.user.userId) {
    throw new Error("Not authorized");
  }

  // Check for existing intake conversation
  const existing = await findIntakeByUserExpertiseId(
    ctx,
    input.userExpertiseId,
  );
  if (existing) {
    return {
      id: existing.id,
      conversation: existing.conversation,
      status: existing.status,
    };
  }

  // Generate initial assistant greeting
  const { content } = await input.continueIntakeConversation(
    [],
    userExpertise.expertiseTitle,
  );

  const conversation: AssessmentMessage[] = [
    { role: "assistant", content },
  ];

  const id = createId();
  await createExpertiseAssessmentResult(ctx, {
    id,
    userExpertiseId: input.userExpertiseId,
    userId: ctx.user.userId,
    conversation,
  });

  return { id, conversation, status: "in_progress" as const };
}
