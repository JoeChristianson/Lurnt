import { z } from "zod";

export const NodeAssessmentSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  nodeId: z.string(),
  prompt: z.string(),
  gradingInstructions: z.string(),
});

export type NodeAssessment = z.infer<typeof NodeAssessmentSchema>;
