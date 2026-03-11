import { expertiseAssessmentResults } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";
import type { AssessmentMessage, IntakeSummary } from "@lurnt/domain";

export async function createExpertiseAssessmentResult(
  ctx: ServiceContext,
  data: {
    id: string;
    userExpertiseId: string;
    userId: string;
    conversation: AssessmentMessage[];
  },
) {
  await ctx.db.client.insert(expertiseAssessmentResults).values({
    id: data.id,
    expertiseAssessmentId: null,
    userExpertiseId: data.userExpertiseId,
    userId: data.userId,
    conversation: data.conversation,
    passed: false,
    status: "in_progress",
  });
}

export async function updateIntakeConversation(
  ctx: ServiceContext,
  id: string,
  conversation: AssessmentMessage[],
) {
  await ctx.db.client
    .update(expertiseAssessmentResults)
    .set({ conversation })
    .where(eq(expertiseAssessmentResults.id, id));
}

export async function completeIntakeResult(
  ctx: ServiceContext,
  id: string,
  summary: IntakeSummary,
) {
  await ctx.db.client
    .update(expertiseAssessmentResults)
    .set({
      status: "completed",
      passed: true,
      summary,
    })
    .where(eq(expertiseAssessmentResults.id, id));
}
