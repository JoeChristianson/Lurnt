import { userExpertises } from "@lurnt/database";
import { eq, and } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

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
