import { z } from "zod";
import { NodeQuizResultSchema, QuizAnswerSchema } from "./model";

export const CreateNodeQuizResultInputSchema = NodeQuizResultSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
  score: true,
  passed: true,
}).extend({
  answers: z.array(QuizAnswerSchema).min(1),
});

export type CreateNodeQuizResultInput = z.infer<typeof CreateNodeQuizResultInputSchema>;
