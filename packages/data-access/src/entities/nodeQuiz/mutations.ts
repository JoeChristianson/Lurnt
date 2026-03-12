import { nodeQuizzes } from "@lurnt/database";
import type { ServiceContext, QuizQuestion } from "@lurnt/domain";

export async function createNodeQuiz(
  ctx: ServiceContext,
  data: {
    id: string;
    nodeId: string;
    questions: QuizQuestion[];
  },
) {
  await ctx.db.client.insert(nodeQuizzes).values({
    id: data.id,
    nodeId: data.nodeId,
    questions: data.questions,
  });
}
