import { z } from "zod";

export const UserExpertiseStatusEnum = z.enum([
  "active",
  "paused",
  "archived",
]);

export type UserExpertiseStatus = z.infer<typeof UserExpertiseStatusEnum>;

export const UserExpertiseSchema = z.object({
  id: z.string(),
  createdOn: z.date(),
  updatedOn: z.date(),
  userId: z.string(),
  expertiseId: z.string(),
  status: UserExpertiseStatusEnum,
});

export type UserExpertise = z.infer<typeof UserExpertiseSchema>;
