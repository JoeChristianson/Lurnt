import { z } from "zod";
import { EdgeSchema } from "./model";

export const CreateEdgeInputSchema = EdgeSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
}).extend({
  justification: z.string().min(1).max(1000),
  weight: z.number().min(0).max(1),
});

export type CreateEdgeInput = z.infer<typeof CreateEdgeInputSchema>;

export const EdgeResponseSchema = EdgeSchema;
export type EdgeResponse = z.infer<typeof EdgeResponseSchema>;
