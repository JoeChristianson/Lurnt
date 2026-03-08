import { z } from "zod";
import { QuizQuestionSchema } from "../NodeQuiz/model";

export const ExpertiseQuizSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  expertiseId: z.string(),
  questions: z.array(QuizQuestionSchema),
});

export type ExpertiseQuiz = z.infer<typeof ExpertiseQuizSchema>;
