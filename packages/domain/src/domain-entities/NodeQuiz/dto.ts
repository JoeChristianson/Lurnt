import { z } from "zod";
import { NodeQuizSchema, QuizQuestionSchema } from "./model";

export const CreateNodeQuizInputSchema = NodeQuizSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
}).extend({
  questions: z.array(QuizQuestionSchema).min(1),
});

export type CreateNodeQuizInput = z.infer<typeof CreateNodeQuizInputSchema>;
