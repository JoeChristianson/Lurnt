import { knowledgeGraphs } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findKnowledgeGraphByUserExpertiseId(
  ctx: ServiceContext,
  userExpertiseId: string,
) {
  const result = await ctx.db.client
    .select()
    .from(knowledgeGraphs)
    .where(eq(knowledgeGraphs.userExpertiseId, userExpertiseId))
    .limit(1);

  return result[0] ?? null;
}
