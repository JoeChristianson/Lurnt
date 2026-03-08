import { z } from "zod";
import { NodeAssessmentSchema } from "./model";

export const CreateNodeAssessmentInputSchema = NodeAssessmentSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type CreateNodeAssessmentInput = z.infer<typeof CreateNodeAssessmentInputSchema>;
