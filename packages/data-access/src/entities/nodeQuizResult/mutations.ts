import { nodeQuizResults } from "@lurnt/database";
import type { ServiceContext, QuizAnswer } from "@lurnt/domain";

export async function createNodeQuizResult(
  ctx: ServiceContext,
  data: {
    id: string;
    nodeQuizId: string;
    knowledgeGraphNodeId: string;
    userId: string;
    answers: QuizAnswer[];
    score: number;
    passed: boolean;
  },
) {
  await ctx.db.client.insert(nodeQuizResults).values({
    id: data.id,
    nodeQuizId: data.nodeQuizId,
    knowledgeGraphNodeId: data.knowledgeGraphNodeId,
    userId: data.userId,
    answers: data.answers,
    score: data.score,
    passed: data.passed,
  });
}
