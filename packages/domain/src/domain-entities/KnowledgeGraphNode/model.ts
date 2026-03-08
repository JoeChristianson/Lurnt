import { z } from "zod";

export const KnowledgeGraphNodeStatusEnum = z.enum([
  "locked",
  "unlocked",
  "completed",
]);

export type KnowledgeGraphNodeStatus = z.infer<typeof KnowledgeGraphNodeStatusEnum>;

export const KnowledgeGraphNodeSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  knowledgeGraphId: z.string(),
  nodeId: z.string(),
  status: KnowledgeGraphNodeStatusEnum,
});

export type KnowledgeGraphNode = z.infer<typeof KnowledgeGraphNodeSchema>;
