import { z } from "zod";
import { AssessmentMessageSchema } from "../NodeAssessmentResult/model";

export const IntakeSummarySchema = z.object({
  overallLevel: z.enum(["beginner", "intermediate", "advanced"]),
  familiarTopics: z.array(z.string()),
  gapAreas: z.array(z.string()),
  goals: z.string(),
  recommendedStartingPoint: z.string(),
});

export type IntakeSummary = z.infer<typeof IntakeSummarySchema>;

export const ExpertiseAssessmentResultSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  expertiseAssessmentId: z.string().nullable(),
  userExpertiseId: z.string(),
  userId: z.string(),
  conversation: z.array(AssessmentMessageSchema),
  passed: z.boolean(),
  status: z.enum(["in_progress", "completed"]),
  summary: IntakeSummarySchema.nullable(),
});

export type ExpertiseAssessmentResult = z.infer<
  typeof ExpertiseAssessmentResultSchema
>;
