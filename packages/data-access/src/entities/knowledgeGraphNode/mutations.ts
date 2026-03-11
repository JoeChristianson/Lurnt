import { knowledgeGraphNodes } from "@lurnt/database";
import type { ServiceContext, KnowledgeGraphNodeStatus } from "@lurnt/domain";

export async function createKnowledgeGraphNode(
  ctx: ServiceContext,
  data: {
    id: string;
    knowledgeGraphId: string;
    nodeId: string;
    status: KnowledgeGraphNodeStatus;
  },
) {
  await ctx.db.client.insert(knowledgeGraphNodes).values({
    id: data.id,
    knowledgeGraphId: data.knowledgeGraphId,
    nodeId: data.nodeId,
    status: data.status,
  });
}
