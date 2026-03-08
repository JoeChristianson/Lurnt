import { z } from "zod";

export const QuizAnswerSchema = z.object({
  questionIndex: z.number(),
  selectedIndex: z.number(),
  correct: z.boolean(),
});

export type QuizAnswer = z.infer<typeof QuizAnswerSchema>;

export const NodeQuizResultSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  nodeQuizId: z.string(),
  knowledgeGraphNodeId: z.string(),
  userId: z.string(),
  answers: z.array(QuizAnswerSchema),
  score: z.number(),
  passed: z.boolean(),
});

export type NodeQuizResult = z.infer<typeof NodeQuizResultSchema>;
