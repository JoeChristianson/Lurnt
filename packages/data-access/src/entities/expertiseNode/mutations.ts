import { expertiseNodes } from "@lurnt/database";
import type { ServiceContext } from "@lurnt/domain";

export async function createExpertiseNode(
  ctx: ServiceContext,
  data: {
    id: string;
    expertiseId: string;
    nodeId: string;
  },
) {
  await ctx.db.client.insert(expertiseNodes).values({
    id: data.id,
    expertiseId: data.expertiseId,
    nodeId: data.nodeId,
  });
}
