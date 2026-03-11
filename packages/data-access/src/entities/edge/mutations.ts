import { edges } from "@lurnt/database";
import type { ServiceContext } from "@lurnt/domain";
import type { EdgeRelation } from "@lurnt/domain";

export async function createEdge(
  ctx: ServiceContext,
  data: {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    relation: EdgeRelation;
    justification: string;
    weight: number;
  },
) {
  await ctx.db.client.insert(edges).values({
    id: data.id,
    sourceNodeId: data.sourceNodeId,
    targetNodeId: data.targetNodeId,
    relation: data.relation,
    justification: data.justification,
    weight: data.weight,
  });
}
