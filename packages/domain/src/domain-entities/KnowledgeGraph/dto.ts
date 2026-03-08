import { z } from "zod";
import { KnowledgeGraphSchema } from "./model";

export const CreateKnowledgeGraphInputSchema = KnowledgeGraphSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
});

export type CreateKnowledgeGraphInput = z.infer<typeof CreateKnowledgeGraphInputSchema>;

export const KnowledgeGraphResponseSchema = KnowledgeGraphSchema;
export type KnowledgeGraphResponse = z.infer<typeof KnowledgeGraphResponseSchema>;
