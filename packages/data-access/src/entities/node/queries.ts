import { nodes, expertiseNodes } from "@lurnt/database";
import { eq, like, and } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findNodesByExpertiseId(
  ctx: ServiceContext,
  expertiseId: string,
) {
  return ctx.db.client
    .select({
      id: nodes.id,
      title: nodes.title,
      description: nodes.description,
    })
    .from(nodes)
    .innerJoin(expertiseNodes, eq(nodes.id, expertiseNodes.nodeId))
    .where(eq(expertiseNodes.expertiseId, expertiseId));
}

export async function findNodeByFuzzyTitle(
  ctx: ServiceContext,
  expertiseId: string,
  title: string,
) {
  const result = await ctx.db.client
    .select({
      id: nodes.id,
      title: nodes.title,
      description: nodes.description,
    })
    .from(nodes)
    .innerJoin(expertiseNodes, eq(nodes.id, expertiseNodes.nodeId))
    .where(
      and(
        eq(expertiseNodes.expertiseId, expertiseId),
        like(nodes.title, title),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}
