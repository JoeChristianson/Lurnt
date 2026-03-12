import { nodeQuizResults } from "@lurnt/database";
import { eq, and, desc } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findQuizResultsByKgNodeId(
  ctx: ServiceContext,
  knowledgeGraphNodeId: string,
  userId: string,
) {
  return ctx.db.client
    .select()
    .from(nodeQuizResults)
    .where(
      and(
        eq(nodeQuizResults.knowledgeGraphNodeId, knowledgeGraphNodeId),
        eq(nodeQuizResults.userId, userId),
      ),
    )
    .orderBy(desc(nodeQuizResults.createdAt));
}

export async function findPassingQuizResult(
  ctx: ServiceContext,
  knowledgeGraphNodeId: string,
  userId: string,
) {
  const result = await ctx.db.client
    .select()
    .from(nodeQuizResults)
    .where(
      and(
        eq(nodeQuizResults.knowledgeGraphNodeId, knowledgeGraphNodeId),
        eq(nodeQuizResults.userId, userId),
        eq(nodeQuizResults.passed, true),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}
