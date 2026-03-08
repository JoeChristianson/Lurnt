import { z } from "zod";

export const ResourceTypeEnum = z.enum([
  "video",
  "article",
  "course",
  "documentation",
  "textbook",
  "exercise",
  "other",
]);

export type ResourceType = z.infer<typeof ResourceTypeEnum>;

export const ResourceSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  nodeId: z.string(),
  url: z.string(),
  title: z.string(),
  type: ResourceTypeEnum,
  description: z.string().nullable(),
  submittedByUserId: z.string().nullable(),
});

export type Resource = z.infer<typeof ResourceSchema>;
