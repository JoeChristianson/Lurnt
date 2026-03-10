import type { UnauthedContext } from "@lurnt/domain";
import { searchExpertises } from "@lurnt/data-access";

export async function search(
  ctx: UnauthedContext,
  input: { query: string },
) {
  return searchExpertises(ctx, input.query);
}
