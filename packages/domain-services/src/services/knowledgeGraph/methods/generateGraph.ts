import { withTx } from "@lurnt/domain";
import type { AuthedContext, IntakeSummary } from "@lurnt/domain";
import type { KnowledgeGraphNodeStatus } from "@lurnt/domain";
import { createId } from "@paralleldrive/cuid2";
import {
  findKnowledgeGraphByUserExpertiseId,
  findUserExpertiseWithTitle,
  findNodeByFuzzyTitle,
  createNode,
  createEdge,
  createExpertiseNode,
  createKnowledgeGraphNode,
  createKnowledgeGraphEdge,
} from "@lurnt/data-access";

export interface GeneratedNode {
  tempId: string;
  title: string;
  description: string;
}

export interface GeneratedEdge {
  sourceTempId: string;
  targetTempId: string;
  relation: "prerequisite" | "related";
  justification: string;
  weight: number;
}

export interface GeneratedGraph {
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
}

export async function generateGraph(
  ctx: AuthedContext,
  input: {
    userExpertiseId: string;
    summary: IntakeSummary;
    generateKnowledgeGraph: (
      expertiseTitle: string,
      summary: IntakeSummary,
    ) => Promise<GeneratedGraph>;
  },
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

  // Generate the graph structure via AI
  const generated = await input.generateKnowledgeGraph(
    userExpertise.expertiseTitle,
    input.summary,
  );

  // Persist everything in a single transaction
  return withTx(ctx, async (txCtx) => {
    // Map tempId → real nodeId
    const tempIdToNodeId = new Map<string, string>();

    // 1. Create or reuse nodes
    for (const genNode of generated.nodes) {
      // Fuzzy match: case-insensitive LIKE search
      const existing = await findNodeByFuzzyTitle(
        txCtx,
        userExpertise.expertiseId,
        genNode.title,
      );

      if (existing) {
        tempIdToNodeId.set(genNode.tempId, existing.id);
      } else {
        const nodeId = createId();
        await createNode(txCtx, {
          id: nodeId,
          title: genNode.title,
          description: genNode.description,
        });
        await createExpertiseNode(txCtx, {
          id: createId(),
          expertiseId: userExpertise.expertiseId,
          nodeId,
        });
        tempIdToNodeId.set(genNode.tempId, nodeId);
      }
    }

    // 2. Create edges
    const edgeIds: string[] = [];
    for (const genEdge of generated.edges) {
      const sourceNodeId = tempIdToNodeId.get(genEdge.sourceTempId);
      const targetNodeId = tempIdToNodeId.get(genEdge.targetTempId);
      if (!sourceNodeId || !targetNodeId) continue;

      const edgeId = createId();
      await createEdge(txCtx, {
        id: edgeId,
        sourceNodeId,
        targetNodeId,
        relation: genEdge.relation,
        justification: genEdge.justification,
        weight: genEdge.weight,
      });
      edgeIds.push(edgeId);
    }

    // 3. Determine initial node statuses based on intake summary
    const familiarLower = input.summary.familiarTopics.map((t) =>
      t.toLowerCase(),
    );
    const startingPointLower =
      input.summary.recommendedStartingPoint.toLowerCase();

    // Build prerequisite map: nodeId → set of prerequisite nodeIds
    const prereqMap = new Map<string, Set<string>>();
    for (const genEdge of generated.edges) {
      if (genEdge.relation !== "prerequisite") continue;
      const sourceNodeId = tempIdToNodeId.get(genEdge.sourceTempId);
      const targetNodeId = tempIdToNodeId.get(genEdge.targetTempId);
      if (!sourceNodeId || !targetNodeId) continue;
      if (!prereqMap.has(sourceNodeId)) {
        prereqMap.set(sourceNodeId, new Set());
      }
      prereqMap.get(sourceNodeId)!.add(targetNodeId);
    }

    // First pass: mark completed nodes
    const completedNodes = new Set<string>();
    for (const genNode of generated.nodes) {
      const nodeId = tempIdToNodeId.get(genNode.tempId)!;
      const titleLower = genNode.title.toLowerCase();
      const isFamiliar = familiarLower.some(
        (topic) =>
          titleLower.includes(topic) || topic.includes(titleLower),
      );
      if (isFamiliar) {
        completedNodes.add(nodeId);
      }
    }

    // Second pass: determine unlocked vs locked
    for (const genNode of generated.nodes) {
      const nodeId = tempIdToNodeId.get(genNode.tempId)!;
      let status: KnowledgeGraphNodeStatus;

      if (completedNodes.has(nodeId)) {
        status = "completed";
      } else {
        const titleLower = genNode.title.toLowerCase();
        const isStartingPoint = titleLower.includes(startingPointLower) ||
          startingPointLower.includes(titleLower);

        // Unlock if: it's the starting point, or all prerequisites are completed
        const prereqs = prereqMap.get(nodeId);
        const allPrereqsMet =
          !prereqs || [...prereqs].every((pid) => completedNodes.has(pid));

        status = isStartingPoint || allPrereqsMet ? "unlocked" : "locked";
      }

      await createKnowledgeGraphNode(txCtx, {
        id: createId(),
        knowledgeGraphId: knowledgeGraph.id,
        nodeId,
        status,
      });
    }

    // 4. Create knowledge graph edges
    for (const edgeId of edgeIds) {
      await createKnowledgeGraphEdge(txCtx, {
        id: createId(),
        knowledgeGraphId: knowledgeGraph.id,
        edgeId,
      });
    }

    return { knowledgeGraphId: knowledgeGraph.id };
  });
}
