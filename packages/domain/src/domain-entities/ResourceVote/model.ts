import { z } from "zod";

export const ResourceVoteSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  resourceId: z.string(),
  userId: z.string(),
  value: z.number(), // +1 or -1
});

export type ResourceVote = z.infer<typeof ResourceVoteSchema>;
