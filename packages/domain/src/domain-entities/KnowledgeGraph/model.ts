import { z } from "zod";

export const KnowledgeGraphSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  userExpertiseId: z.string(),
});

export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;
