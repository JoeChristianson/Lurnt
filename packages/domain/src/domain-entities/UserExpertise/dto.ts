import { z } from "zod";
import { UserExpertiseSchema } from "./model";

export const CreateUserExpertiseInputSchema = UserExpertiseSchema.omit({
  id: true,
  createdOn: true,
  updatedOn: true,
  status: true,
});

export type CreateUserExpertiseInput = z.infer<typeof CreateUserExpertiseInputSchema>;

export const UserExpertiseResponseSchema = UserExpertiseSchema;
export type UserExpertiseResponse = z.infer<typeof UserExpertiseResponseSchema>;
