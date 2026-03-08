import { z } from "zod";

export const EdgeRelationEnum = z.enum(["prerequisite", "related"]);
export type EdgeRelation = z.infer<typeof EdgeRelationEnum>;

export const EdgeSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  sourceNodeId: z.string(),
  targetNodeId: z.string(),
  relation: EdgeRelationEnum,
  justification: z.string(),
  weight: z.number(),
});

export type Edge = z.infer<typeof EdgeSchema>;
