import { userExpertises, expertises } from "@lurnt/database";
import { eq, and } from "drizzle-orm";
import type { ServiceContext, UserExpertise } from "@lurnt/domain";

export async function findActiveUserExpertises(
  ctx: ServiceContext,
  userId: string,
) {
  return ctx.db.client
    .select({
      id: userExpertises.id,
      expertiseId: userExpertises.expertiseId,
      status: userExpertises.status,
    })
    .from(userExpertises)
    .where(
      and(
        eq(userExpertises.userId, userId),
        eq(userExpertises.status, "active"),
      ),
    );
}

export async function findUserExpertisesWithTitles(
  ctx: ServiceContext,
  userId: string,
) {
  const res: {
    id: string;
    expertiseId: string;
    status: string;
    title: string;
    description: string | null;
  }[] = await ctx.db.client
    .select({
      id: userExpertises.id,
      expertiseId: userExpertises.expertiseId,
      status: userExpertises.status,
      title: expertises.title,
      description: expertises.description,
    })
    .from(userExpertises)
    .innerJoin(expertises, eq(userExpertises.expertiseId, expertises.id))
    .where(
      and(
        eq(userExpertises.userId, userId),
        eq(userExpertises.status, "active"),
      ),
    );
  return res;
}
