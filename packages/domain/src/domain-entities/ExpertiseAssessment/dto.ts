import { z } from "zod";
import { ExpertiseAssessmentSchema } from "./model";

export const CreateExpertiseAssessmentInputSchema = ExpertiseAssessmentSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type CreateExpertiseAssessmentInput = z.infer<typeof CreateExpertiseAssessmentInputSchema>;
