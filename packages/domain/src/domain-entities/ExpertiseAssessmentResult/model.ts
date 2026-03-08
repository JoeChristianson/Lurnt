import { z } from "zod";
import { AssessmentMessageSchema } from "../NodeAssessmentResult/model";

export const ExpertiseAssessmentResultSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  expertiseAssessmentId: z.string(),
  userExpertiseId: z.string(),
  userId: z.string(),
  conversation: z.array(AssessmentMessageSchema),
  passed: z.boolean(),
});

export type ExpertiseAssessmentResult = z.infer<typeof ExpertiseAssessmentResultSchema>;
