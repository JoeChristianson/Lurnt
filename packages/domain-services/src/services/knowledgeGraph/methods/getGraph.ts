import type { AuthedContext } from "@lurnt/domain";
import {
  findKnowledgeGraphByUserExpertiseId,
  findUserExpertiseWithTitle,
  findKnowledgeGraphNodes,
  findKnowledgeGraphEdges,
} from "@lurnt/data-access";

export async function getGraph(
  ctx: AuthedContext,
  input: { userExpertiseId: string },
) {
  const userExpertise = await findUserExpertiseWithTitle(
    ctx,
    input.userExpertiseId,
  );
  if (!userExpertise || userExpertise.userId !== ctx.user.userId) {
    throw new Error("Not authorized");
  }

  const knowledgeGraph = await findKnowledgeGraphByUserExpertiseId(
    ctx,
    input.userExpertiseId,
  );
  if (!knowledgeGraph) {
    throw new Error("Knowledge graph not found");
  }

  const [graphNodes, graphEdges] = await Promise.all([
    findKnowledgeGraphNodes(ctx, knowledgeGraph.id),
    findKnowledgeGraphEdges(ctx, knowledgeGraph.id),
  ]);

  return {
    knowledgeGraphId: knowledgeGraph.id,
    expertiseTitle: userExpertise.expertiseTitle,
    nodes: graphNodes,
    edges: graphEdges,
  };
}
