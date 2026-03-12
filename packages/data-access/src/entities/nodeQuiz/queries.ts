import { nodeQuizzes } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";
import { NodeQuiz } from "@lurnt/domain";
export async function findNodeQuizByNodeId(
  ctx: ServiceContext,
  nodeId: string,
) {
  const result: NodeQuiz[] = await ctx.db.client
    .select({
      id: nodeQuizzes.id,
      nodeId: nodeQuizzes.nodeId,
      questions: nodeQuizzes.questions,
      createdAt: nodeQuizzes.createdAt,
      updatedAt: nodeQuizzes.updatedAt,
    })
    .from(nodeQuizzes)
    .where(eq(nodeQuizzes.nodeId, nodeId))
    .limit(1);

  return result[0] ?? null;
}
