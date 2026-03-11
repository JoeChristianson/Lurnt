import { nodes } from "@lurnt/database";
import type { ServiceContext } from "@lurnt/domain";

export async function createNode(
  ctx: ServiceContext,
  data: {
    id: string;
    title: string;
    description: string | null;
  },
) {
  await ctx.db.client.insert(nodes).values({
    id: data.id,
    title: data.title,
    description: data.description,
  });
}
