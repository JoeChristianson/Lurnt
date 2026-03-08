import { z } from "zod";

export const NodeSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  title: z.string(),
  description: z.string().nullable(),
});

export type Node = z.infer<typeof NodeSchema>;
