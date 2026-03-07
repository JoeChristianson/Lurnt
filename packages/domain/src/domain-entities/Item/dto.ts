import { z } from "zod";

export const CreateItemInputSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).default(""),
});

export type CreateItemInput = z.infer<typeof CreateItemInputSchema>;

export const UpdateItemInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
});

export type UpdateItemInput = z.infer<typeof UpdateItemInputSchema>;

export const ListItemsInputSchema = z.object({
  userId: z.string().optional(),
});

export type ListItemsInput = z.infer<typeof ListItemsInputSchema>;
