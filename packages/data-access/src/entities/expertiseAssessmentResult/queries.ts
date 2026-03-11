import {
  expertiseAssessmentResults,
  userExpertises,
  expertises,
} from "@lurnt/database";
import { eq, and, isNull } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findIntakeByUserExpertiseId(
  ctx: ServiceContext,
  userExpertiseId: string,
) {
  const result = await ctx.db.client
    .select()
    .from(expertiseAssessmentResults)
    .where(
      and(
        eq(expertiseAssessmentResults.userExpertiseId, userExpertiseId),
        isNull(expertiseAssessmentResults.expertiseAssessmentId),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function findUserExpertiseWithTitle(
  ctx: ServiceContext,
  userExpertiseId: string,
) {
  const result = await ctx.db.client
    .select({
      id: userExpertises.id,
      userId: userExpertises.userId,
      expertiseId: userExpertises.expertiseId,
      expertiseTitle: expertises.title,
    })
    .from(userExpertises)
    .innerJoin(expertises, eq(userExpertises.expertiseId, expertises.id))
    .where(eq(userExpertises.id, userExpertiseId))
    .limit(1);

  return result[0] ?? null;
}
