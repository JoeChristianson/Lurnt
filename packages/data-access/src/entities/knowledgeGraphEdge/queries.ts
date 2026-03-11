import { knowledgeGraphEdges, edges } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findKnowledgeGraphEdges(
  ctx: ServiceContext,
  knowledgeGraphId: string,
) {
  return ctx.db.client
    .select({
      id: knowledgeGraphEdges.id,
      knowledgeGraphId: knowledgeGraphEdges.knowledgeGraphId,
      edgeId: knowledgeGraphEdges.edgeId,
      sourceNodeId: edges.sourceNodeId,
      targetNodeId: edges.targetNodeId,
      relation: edges.relation,
      weight: edges.weight,
    })
    .from(knowledgeGraphEdges)
    .innerJoin(edges, eq(knowledgeGraphEdges.edgeId, edges.id))
    .where(eq(knowledgeGraphEdges.knowledgeGraphId, knowledgeGraphId));
}
