import { z } from "zod";
import { router, publicProcedure, protectedProcedure, partialProtectedProcedure } from "../server";
import { ExpertiseService } from "@lurnt/domain-services";
import { findActiveUserExpertises } from "@lurnt/data-access";
import type { UnauthedContext, AuthedContext } from "@lurnt/domain";

function toUnauthedCtx(ctx: {
  db: { _type: "db"; client: any };
}): UnauthedContext {
  return { _type: "unauthed", db: ctx.db };
}

function toAuthedCtx(ctx: {
  db: { _type: "db"; client: any };
  user: { userId: string; email: string; handle: string };
}): AuthedContext {
  return { _type: "authed", db: ctx.db, user: ctx.user };
}

export const expertiseRouter = router({
  search: publicProcedure
    .input(z.object({ query: z.string().min(1).max(255) }))
    .query(async ({ ctx, input }) => {
      return ExpertiseService.search.execute(toUnauthedCtx(ctx), input);
    }),

  hasActive: partialProtectedProcedure
    .query(async ({ ctx }) => {
      const active = await findActiveUserExpertises(
        { _type: "unauthed", db: ctx.db } as UnauthedContext,
        ctx.user.userId,
      );
      return { hasActive: active.length > 0 };
    }),

  choose: protectedProcedure
    .input(
      z.object({
        expertiseId: z.string().optional(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(1000).nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ExpertiseService.choose.execute(toAuthedCtx(ctx), input);
    }),
});
