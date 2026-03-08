import { z } from "zod";

export const KnowledgeGraphEdgeSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  knowledgeGraphId: z.string(),
  edgeId: z.string(),
});

export type KnowledgeGraphEdge = z.infer<typeof KnowledgeGraphEdgeSchema>;
