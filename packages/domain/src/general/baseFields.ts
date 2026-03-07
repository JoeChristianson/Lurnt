import { z } from "zod";

export const BaseFieldsSchema = z.object({
  id: z.string().uuid(),
  createdOn: z.date(),
  updatedOn: z.date(),
  createdBy: z.string().uuid().nullable(),
  updatedBy: z.string().uuid().nullable(),
});
