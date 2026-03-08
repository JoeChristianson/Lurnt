import { z } from "zod";
import { NodeSchema } from "./model";

export const CreateNodeInputSchema = NodeSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
}).extend({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
});

export type CreateNodeInput = z.infer<typeof CreateNodeInputSchema>;

export const UpdateNodeInputSchema = NodeSchema.pick({
  title: true,
  description: true,
}).partial();

export type UpdateNodeInput = z.infer<typeof UpdateNodeInputSchema>;

export const NodeResponseSchema = NodeSchema;
export type NodeResponse = z.infer<typeof NodeResponseSchema>;
