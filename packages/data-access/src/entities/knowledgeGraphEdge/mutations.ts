import { knowledgeGraphEdges } from "@lurnt/database";
import type { ServiceContext } from "@lurnt/domain";

export async function createKnowledgeGraphEdge(
  ctx: ServiceContext,
  data: {
    id: string;
    knowledgeGraphId: string;
    edgeId: string;
  },
) {
  await ctx.db.client.insert(knowledgeGraphEdges).values({
    id: data.id,
    knowledgeGraphId: data.knowledgeGraphId,
    edgeId: data.edgeId,
  });
}
