import { z } from "zod";
import { QuizAnswerSchema } from "../NodeQuizResult/model";

export const ExpertiseQuizResultSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  expertiseQuizId: z.string(),
  userExpertiseId: z.string(),
  userId: z.string(),
  answers: z.array(QuizAnswerSchema),
  score: z.number(),
  passed: z.boolean(),
});

export type ExpertiseQuizResult = z.infer<typeof ExpertiseQuizResultSchema>;
