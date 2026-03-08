import { z } from "zod";

export const ExpertiseSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  title: z.string(),
  description: z.string().nullable(),
});

export type Expertise = z.infer<typeof ExpertiseSchema>;
