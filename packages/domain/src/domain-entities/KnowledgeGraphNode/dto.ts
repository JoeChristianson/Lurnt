import { z } from "zod";
import { KnowledgeGraphNodeSchema } from "./model";

export const CreateKnowledgeGraphNodeInputSchema = KnowledgeGraphNodeSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
  status: true,
});

export type CreateKnowledgeGraphNodeInput = z.infer<typeof CreateKnowledgeGraphNodeInputSchema>;

export const KnowledgeGraphNodeResponseSchema = KnowledgeGraphNodeSchema;
export type KnowledgeGraphNodeResponse = z.infer<typeof KnowledgeGraphNodeResponseSchema>;
