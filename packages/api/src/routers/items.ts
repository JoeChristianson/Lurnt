import { z } from "zod";
import { router, protectedProcedure } from "../server";
import { ItemService } from "@lurnt/domain-services";
import type { AuthedContext } from "@lurnt/domain";

function toAuthedCtx(ctx: {
  db: { _type: "db"; client: any };
  user: { userId: string; email: string; handle: string };
}): AuthedContext {
  return { _type: "authed", db: ctx.db, user: ctx.user };
}

export const itemsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ItemService.list.execute(toAuthedCtx(ctx), {});
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ItemService.getById.execute(toAuthedCtx(ctx), input);
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().max(2000).default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ItemService.create.execute(toAuthedCtx(ctx), input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ItemService.update.execute(toAuthedCtx(ctx), input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ItemService.delete.execute(toAuthedCtx(ctx), input);
    }),
});
