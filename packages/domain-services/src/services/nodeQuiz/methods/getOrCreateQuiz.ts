import type { AuthedContext, QuizQuestion } from "@lurnt/domain";
import { createId } from "@paralleldrive/cuid2";
import {
  findKnowledgeGraphNodeWithOwner,
  findNodeQuizByNodeId,
  createNodeQuiz,
  findPassingQuizResult,
} from "@lurnt/data-access";

export async function getOrCreateQuiz(
  ctx: AuthedContext,
  input: {
    knowledgeGraphNodeId: string;
    generateQuizQuestions: (
      nodeTitle: string,
      nodeDescription: string | null,
    ) => Promise<QuizQuestion[]>;
  },
) {
  const kgNode = await findKnowledgeGraphNodeWithOwner(
    ctx,
    input.knowledgeGraphNodeId,
  );
  if (!kgNode || kgNode.userId !== ctx.user.userId) {
    throw new Error("Not authorized");
  }

  if (kgNode.status === "locked") {
    throw new Error("This node is locked. Complete prerequisites first.");
  }

  // Check if quiz already exists for this node
  let quiz = await findNodeQuizByNodeId(ctx, kgNode.nodeId);

  if (!quiz) {
    // Generate quiz questions on demand
    const questions = await input.generateQuizQuestions(
      kgNode.nodeTitle,
      kgNode.nodeDescription,
    );

    const quizId = createId();
    await createNodeQuiz(ctx, {
      id: quizId,
      nodeId: kgNode.nodeId,
      questions,
    });

    quiz = {
      id: quizId,
      nodeId: kgNode.nodeId,
      questions,
      createdOn: new Date(),
      updatedOn: new Date(),
    };
  }

  // Check if user already passed
  const passingResult = await findPassingQuizResult(
    ctx,
    input.knowledgeGraphNodeId,
    ctx.user.userId,
  );

  return {
    quizId: quiz.id,
    nodeTitle: kgNode.nodeTitle,
    nodeDescription: kgNode.nodeDescription,
    status: kgNode.status,
    questions: quiz.questions.map((q: QuizQuestion) => ({
      question: q.question,
      choices: q.choices,
    })),
    alreadyPassed: !!passingResult,
  };
}
