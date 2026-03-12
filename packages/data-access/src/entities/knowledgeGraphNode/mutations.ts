import { knowledgeGraphNodes } from "@lurnt/database";
import { eq } from "drizzle-orm";
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

export async function updateKnowledgeGraphNodeStatus(
  ctx: ServiceContext,
  kgNodeId: string,
  status: KnowledgeGraphNodeStatus,
) {
  await ctx.db.client
    .update(knowledgeGraphNodes)
    .set({ status })
    .where(eq(knowledgeGraphNodes.id, kgNodeId));
}
