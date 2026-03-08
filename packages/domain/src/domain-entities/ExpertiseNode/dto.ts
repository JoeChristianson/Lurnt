import { z } from "zod";
import { ExpertiseNodeSchema } from "./model";

export const CreateExpertiseNodeInputSchema = ExpertiseNodeSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type CreateExpertiseNodeInput = z.infer<typeof CreateExpertiseNodeInputSchema>;
