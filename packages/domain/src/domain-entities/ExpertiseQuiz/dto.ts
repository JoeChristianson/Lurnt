import { z } from "zod";
import { ExpertiseQuizSchema } from "./model";
import { QuizQuestionSchema } from "../NodeQuiz/model";

export const CreateExpertiseQuizInputSchema = ExpertiseQuizSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
}).extend({
  questions: z.array(QuizQuestionSchema).min(1),
});

export type CreateExpertiseQuizInput = z.infer<typeof CreateExpertiseQuizInputSchema>;
