import {
  knowledgeGraphNodes,
  knowledgeGraphs,
  nodes,
  userExpertises,
} from "@lurnt/database";
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

export async function findKnowledgeGraphNodeById(
  ctx: ServiceContext,
  kgNodeId: string,
) {
  const result = await ctx.db.client
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
    .where(eq(knowledgeGraphNodes.id, kgNodeId))
    .limit(1);

  return result[0] ?? null;
}

export async function findKnowledgeGraphNodeWithOwner(
  ctx: ServiceContext,
  kgNodeId: string,
) {
  const result = await ctx.db.client
    .select({
      id: knowledgeGraphNodes.id,
      knowledgeGraphId: knowledgeGraphNodes.knowledgeGraphId,
      nodeId: knowledgeGraphNodes.nodeId,
      status: knowledgeGraphNodes.status,
      nodeTitle: nodes.title,
      nodeDescription: nodes.description,
      userExpertiseId: knowledgeGraphs.userExpertiseId,
      userId: userExpertises.userId,
    })
    .from(knowledgeGraphNodes)
    .innerJoin(nodes, eq(knowledgeGraphNodes.nodeId, nodes.id))
    .innerJoin(
      knowledgeGraphs,
      eq(knowledgeGraphNodes.knowledgeGraphId, knowledgeGraphs.id),
    )
    .innerJoin(
      userExpertises,
      eq(knowledgeGraphs.userExpertiseId, userExpertises.id),
    )
    .where(eq(knowledgeGraphNodes.id, kgNodeId))
    .limit(1);

  return result[0] ?? null;
}
