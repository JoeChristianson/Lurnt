import { userExpertises } from "@lurnt/database";
import type { ServiceContext } from "@lurnt/domain";

export async function createUserExpertise(
  ctx: ServiceContext,
  data: {
    id: string;
    userId: string;
    expertiseId: string;
  },
) {
  await ctx.db.client.insert(userExpertises).values({
    id: data.id,
    userId: data.userId,
    expertiseId: data.expertiseId,
  });
}
