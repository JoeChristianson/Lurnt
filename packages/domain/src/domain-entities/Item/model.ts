import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Item = z.infer<typeof ItemSchema>;
