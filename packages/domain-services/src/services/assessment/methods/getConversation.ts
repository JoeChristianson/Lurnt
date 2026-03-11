import type { AuthedContext } from "@lurnt/domain";
import {
  findIntakeByUserExpertiseId,
  findUserExpertiseWithTitle,
} from "@lurnt/data-access";

export async function getConversation(
  ctx: AuthedContext,
  input: { userExpertiseId: string },
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
    return null;
  }

  return {
    id: existing.id,
    conversation: existing.conversation,
    status: existing.status,
    summary: existing.summary,
  };
}
