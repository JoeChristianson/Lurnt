import { z } from "zod";
import { ResourceSchema, ResourceTypeEnum } from "./model";

export const CreateResourceInputSchema = ResourceSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
}).extend({
  url: z.string().url().max(2000),
  title: z.string().min(1).max(500),
  type: ResourceTypeEnum,
  description: z.string().max(2000).nullable().optional(),
});

export type CreateResourceInput = z.infer<typeof CreateResourceInputSchema>;

export const ResourceResponseSchema = ResourceSchema;
export type ResourceResponse = z.infer<typeof ResourceResponseSchema>;
