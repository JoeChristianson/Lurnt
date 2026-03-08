import { z } from "zod";

export const ExpertiseAssessmentSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  expertiseId: z.string(),
  prompt: z.string(),
  gradingInstructions: z.string(),
});

export type ExpertiseAssessment = z.infer<typeof ExpertiseAssessmentSchema>;
