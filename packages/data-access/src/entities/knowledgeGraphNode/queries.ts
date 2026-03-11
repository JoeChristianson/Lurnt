import { knowledgeGraphNodes, nodes } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findKnowledgeGraphNodes(
  ctx: ServiceContext,
  knowledgeGraphId: string,
) {
  return ctx.db.client
    .select({
      id: knowledgeGraphNodes.id,
      knowledgeGraphId: knowledgeGraphNodes.knowledgeGraphId,
      nodeId: knowledgeGraphNodes.nodeId,
      status: knowledgeGraphNodes.status,
      nodeTitle: nodes.title,
      nodeDescription: nodes.description,
    })
    .from(knowledgeGraphNodes)
    .innerJoin(nodes, eq(knowledgeGraphNodes.nodeId, nodes.id))
    .where(eq(knowledgeGraphNodes.knowledgeGraphId, knowledgeGraphId));
}
