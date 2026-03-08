import { z } from "zod";
import { ExpertiseSchema } from "./model";

export const CreateExpertiseInputSchema = ExpertiseSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
}).extend({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).nullable().optional(),
});

export type CreateExpertiseInput = z.infer<typeof CreateExpertiseInputSchema>;

export const ExpertiseResponseSchema = ExpertiseSchema;
export type ExpertiseResponse = z.infer<typeof ExpertiseResponseSchema>;
