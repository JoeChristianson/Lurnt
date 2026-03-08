import { z } from "zod";

export const AssessmentMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

export type AssessmentMessage = z.infer<typeof AssessmentMessageSchema>;

export const NodeAssessmentResultSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  nodeAssessmentId: z.string(),
  knowledgeGraphNodeId: z.string(),
  userId: z.string(),
  conversation: z.array(AssessmentMessageSchema),
  passed: z.boolean(),
});

export type NodeAssessmentResult = z.infer<typeof NodeAssessmentResultSchema>;
