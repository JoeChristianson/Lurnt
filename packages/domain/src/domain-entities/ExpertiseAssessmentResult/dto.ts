import { z } from "zod";
import { ExpertiseAssessmentResultSchema } from "./model";
import { AssessmentMessageSchema } from "../NodeAssessmentResult/model";

export const CreateExpertiseAssessmentResultInputSchema =
  ExpertiseAssessmentResultSchema.omit({
    id: true,
    createdOn: true,
    updatedOn: true,
    passed: true,
    status: true,
    summary: true,
  }).extend({
    conversation: z.array(AssessmentMessageSchema).min(1),
  });

export type CreateExpertiseAssessmentResultInput = z.infer<
  typeof CreateExpertiseAssessmentResultInputSchema
>;
