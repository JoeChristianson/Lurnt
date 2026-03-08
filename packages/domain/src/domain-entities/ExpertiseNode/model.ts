import { z } from "zod";

export const ExpertiseNodeSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  expertiseId: z.string(),
  nodeId: z.string(),
});

export type ExpertiseNode = z.infer<typeof ExpertiseNodeSchema>;
