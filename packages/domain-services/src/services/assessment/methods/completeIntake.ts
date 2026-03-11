import type { AuthedContext, AssessmentMessage, IntakeSummary } from "@lurnt/domain";
import {
  findIntakeByUserExpertiseId,
  findUserExpertiseWithTitle,
  completeIntakeResult,
} from "@lurnt/data-access";

export async function completeIntake(
  ctx: AuthedContext,
  input: {
    userExpertiseId: string;
    generateIntakeSummary: (
      messages: AssessmentMessage[],
      expertiseTitle: string,
    ) => Promise<IntakeSummary>;
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
    throw new Error("No intake conversation found.");
  }
  if (existing.status === "completed") {
    return { summary: existing.summary as IntakeSummary };
  }

  const summary = await input.generateIntakeSummary(
    existing.conversation,
    userExpertise.expertiseTitle,
  );

  await completeIntakeResult(ctx, existing.id, summary);

  return { summary };
}
