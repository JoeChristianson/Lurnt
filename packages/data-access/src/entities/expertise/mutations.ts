import { expertises } from "@lurnt/database";
import type { ServiceContext } from "@lurnt/domain";

export async function createExpertise(
  ctx: ServiceContext,
  data: {
    id: string;
    title: string;
    description: string | null;
  },
) {
  await ctx.db.client.insert(expertises).values({
    id: data.id,
    title: data.title,
    description: data.description,
  });
}
