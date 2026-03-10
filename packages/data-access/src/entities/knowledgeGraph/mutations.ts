import { knowledgeGraphs } from "@lurnt/database";
import type { ServiceContext } from "@lurnt/domain";

export async function createKnowledgeGraph(
  ctx: ServiceContext,
  data: {
    id: string;
    userExpertiseId: string;
  },
) {
  await ctx.db.client.insert(knowledgeGraphs).values({
    id: data.id,
    userExpertiseId: data.userExpertiseId,
  });
}
