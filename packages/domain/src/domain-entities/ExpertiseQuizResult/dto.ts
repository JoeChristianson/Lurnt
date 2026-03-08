import { z } from "zod";
import { ExpertiseQuizResultSchema } from "./model";
import { QuizAnswerSchema } from "../NodeQuizResult/model";

export const CreateExpertiseQuizResultInputSchema = ExpertiseQuizResultSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
  score: true,
  passed: true,
}).extend({
  answers: z.array(QuizAnswerSchema).min(1),
});

export type CreateExpertiseQuizResultInput = z.infer<typeof CreateExpertiseQuizResultInputSchema>;
