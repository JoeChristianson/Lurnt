import { z } from "zod";
import { NodeAssessmentResultSchema, AssessmentMessageSchema } from "./model";

export const CreateNodeAssessmentResultInputSchema = NodeAssessmentResultSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
  passed: true,
}).extend({
  conversation: z.array(AssessmentMessageSchema).min(1),
});

export type CreateNodeAssessmentResultInput = z.infer<typeof CreateNodeAssessmentResultInputSchema>;
