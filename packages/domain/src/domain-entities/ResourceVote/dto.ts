import { z } from "zod";
import { ResourceVoteSchema } from "./model";

export const CreateResourceVoteInputSchema = ResourceVoteSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
}).extend({
  value: z.union([z.literal(1), z.literal(-1)]),
});

export type CreateResourceVoteInput = z.infer<typeof CreateResourceVoteInputSchema>;
