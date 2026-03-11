import type { AuthedContext, AssessmentMessage } from "@lurnt/domain";
import {
  findIntakeByUserExpertiseId,
  findUserExpertiseWithTitle,
  updateIntakeConversation,
} from "@lurnt/data-access";

export async function sendMessage(
  ctx: AuthedContext,
  input: {
    userExpertiseId: string;
    message: string;
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
  if (!userExpertise || userExpertise.userId !== ctx.user.userId) {
    throw new Error("Not authorized");
  }

  const existing = await findIntakeByUserExpertiseId(
    ctx,
    input.userExpertiseId,
  );
  if (!existing) {
    throw new Error("No intake conversation found. Call startIntake first.");
  }
  if (existing.status === "completed") {
    throw new Error("Intake conversation is already completed.");
  }

  const updatedConversation: AssessmentMessage[] = [
    ...existing.conversation,
    { role: "user", content: input.message },
  ];

  const { content, isComplete } = await input.continueIntakeConversation(
    updatedConversation,
    userExpertise.expertiseTitle,
  );

  updatedConversation.push({ role: "assistant", content });

  await updateIntakeConversation(ctx, existing.id, updatedConversation);

  return {
    assistantMessage: content,
    isComplete,
    conversation: updatedConversation,
  };
}
