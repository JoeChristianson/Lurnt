import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../server";
import { KnowledgeGraphService } from "@lurnt/domain-services";
import { generateKnowledgeGraph } from "@lurnt/ai";
import type { AuthedContext } from "@lurnt/domain";

function toAuthedCtx(ctx: {
  db: { _type: "db"; client: any };
  user: { userId: string; email: string; handle: string };
}): AuthedContext {
  return { _type: "authed", db: ctx.db, user: ctx.user };
}

export const knowledgeGraphRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        userExpertiseId: z.string().min(1),
        summary: z.object({
          overallLevel: z.enum(["beginner", "intermediate", "advanced"]),
          familiarTopics: z.array(z.string()),
          gapAreas: z.array(z.string()),
          goals: z.string(),
          recommendedStartingPoint: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await KnowledgeGraphService.generateGraph.execute(
          toAuthedCtx(ctx),
          { ...input, generateKnowledgeGraph },
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authorized") {
          throw new TRPCError({ code: "FORBIDDEN", message: error.message });
        }
        throw error;
      }
    }),

  getGraph: protectedProcedure
    .input(z.object({ userExpertiseId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        return await KnowledgeGraphService.getGraph.execute(
          toAuthedCtx(ctx),
          input,
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authorized") {
          throw new TRPCError({ code: "FORBIDDEN", message: error.message });
        }
        throw error;
      }
    }),
});
