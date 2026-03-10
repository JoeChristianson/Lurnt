import { expertises } from "@lurnt/database";
import { like } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function searchExpertises(
  ctx: ServiceContext,
  query: string,
  limit = 10,
) {
  const result = await ctx.db.client
    .select({
      id: expertises.id,
      title: expertises.title,
      description: expertises.description,
    })
    .from(expertises)
    .where(like(expertises.title, `%${query}%`))
    .limit(limit);

  return result;
}
