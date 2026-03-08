import { z } from "zod";

export const QuizQuestionSchema = z.object({
  question: z.string(),
  choices: z.array(z.string()),
  correctIndex: z.number(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const NodeQuizSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  nodeId: z.string(),
  questions: z.array(QuizQuestionSchema),
});

export type NodeQuiz = z.infer<typeof NodeQuizSchema>;
