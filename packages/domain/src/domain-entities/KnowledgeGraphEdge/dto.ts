import { z } from "zod";
import { KnowledgeGraphEdgeSchema } from "./model";

export const CreateKnowledgeGraphEdgeInputSchema = KnowledgeGraphEdgeSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type CreateKnowledgeGraphEdgeInput = z.infer<typeof CreateKnowledgeGraphEdgeInputSchema>;
