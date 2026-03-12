import type { AuthedContext, QuizAnswer, QuizQuestion } from "@lurnt/domain";
import { createId } from "@paralleldrive/cuid2";
import {
  findKnowledgeGraphNodeWithOwner,
  findNodeQuizByNodeId,
  createNodeQuizResult,
  updateKnowledgeGraphNodeStatus,
  findKnowledgeGraphNodes,
  findKnowledgeGraphEdges,
} from "@lurnt/data-access";

const PASSING_SCORE = 0.8;

export async function submitQuiz(
  ctx: AuthedContext,
  input: {
    knowledgeGraphNodeId: string;
    quizId: string;
    selectedAnswers: number[];
  },
) {
  const kgNode = await findKnowledgeGraphNodeWithOwner(
    ctx,
    input.knowledgeGraphNodeId,
  );
  if (!kgNode || kgNode.userId !== ctx.user.userId) {
    throw new Error("Not authorized");
  }

  const quiz = await findNodeQuizByNodeId(ctx, kgNode.nodeId);
  if (!quiz || quiz.id !== input.quizId) {
    throw new Error("Quiz not found");
  }

  if (input.selectedAnswers.length !== quiz.questions.length) {
    throw new Error("Must answer all questions");
  }

  // Grade the quiz
  const answers: QuizAnswer[] = quiz.questions.map((q: QuizQuestion, i: number) => ({
    questionIndex: i,
    selectedIndex: input.selectedAnswers[i],
    correct: input.selectedAnswers[i] === q.correctIndex,
  }));

  const correctCount = answers.filter((a) => a.correct).length;
  const score = correctCount / quiz.questions.length;
  const passed = score >= PASSING_SCORE;

  // Save the result
  await createNodeQuizResult(ctx, {
    id: createId(),
    nodeQuizId: quiz.id,
    knowledgeGraphNodeId: input.knowledgeGraphNodeId,
    userId: ctx.user.userId,
    answers,
    score,
    passed,
  });

  // If passed and node was unlocked, mark as completed and unlock downstream
  if (passed && kgNode.status === "unlocked") {
    await updateKnowledgeGraphNodeStatus(
      ctx,
      input.knowledgeGraphNodeId,
      "completed",
    );

    // Unlock downstream nodes whose prerequisites are now all completed
    await unlockDownstreamNodes(ctx, kgNode.knowledgeGraphId);
  }

  return {
    answers,
    score,
    passed,
    correctCount,
    totalQuestions: quiz.questions.length,
  };
}

async function unlockDownstreamNodes(
  ctx: AuthedContext,
  knowledgeGraphId: string,
) {
  // Re-fetch all nodes to get current statuses
  const allNodes = await findKnowledgeGraphNodes(ctx, knowledgeGraphId);

  const allEdges = await findKnowledgeGraphEdges(ctx, knowledgeGraphId);

  const completedNodeIds = new Set(
    allNodes
      .filter((n: { status: string }) => n.status === "completed")
      .map((n: { nodeId: string }) => n.nodeId),
  );

  // Build prereq map: nodeId → set of prerequisite nodeIds
  const prereqMap = new Map<string, Set<string>>();
  for (const edge of allEdges) {
    if (edge.relation === "prerequisite") {
      if (!prereqMap.has(edge.sourceNodeId)) {
        prereqMap.set(edge.sourceNodeId, new Set());
      }
      prereqMap.get(edge.sourceNodeId)!.add(edge.targetNodeId);
    }
  }

  // Find locked nodes whose prereqs are all completed
  for (const node of allNodes) {
    if (node.status !== "locked") continue;

    const prereqs = prereqMap.get(node.nodeId);
    if (!prereqs || prereqs.size === 0) continue;

    const allMet = [...prereqs].every((pid) => completedNodeIds.has(pid));
    if (allMet) {
      await updateKnowledgeGraphNodeStatus(ctx, node.id, "unlocked");
    }
  }
}
