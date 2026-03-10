import { withTx } from "@lurnt/domain";
import type { AuthedContext } from "@lurnt/domain";
import { validateExpertiseTitle } from "@lurnt/domain";
import { createId } from "@paralleldrive/cuid2";
import { createExpertise } from "@lurnt/data-access";
import { createUserExpertise } from "@lurnt/data-access";
import { createKnowledgeGraph } from "@lurnt/data-access";

export async function choose(
  ctx: AuthedContext,
  input: { expertiseId?: string; title?: string; description?: string | null },
) {
  return withTx(ctx, async (txCtx) => {
    let expertiseId = input.expertiseId;

    if (!expertiseId) {
      if (!input.title) {
        throw new Error("Either expertiseId or title must be provided");
      }
      validateExpertiseTitle(input.title);

      expertiseId = createId();
      await createExpertise(txCtx, {
        id: expertiseId,
        title: input.title,
        description: input.description ?? null,
      });
    }

    const userExpertiseId = createId();
    await createUserExpertise(txCtx, {
      id: userExpertiseId,
      userId: txCtx.user.userId,
      expertiseId,
    });

    const knowledgeGraphId = createId();
    await createKnowledgeGraph(txCtx, {
      id: knowledgeGraphId,
      userExpertiseId,
    });

    return {
      expertiseId,
      userExpertiseId,
      knowledgeGraphId,
    };
  });
}
