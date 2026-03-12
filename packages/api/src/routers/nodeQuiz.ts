import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../server";
import { NodeQuizService } from "@lurnt/domain-services";
import { generateQuizQuestions } from "@lurnt/ai";
import type { AuthedContext } from "@lurnt/domain";

function toAuthedCtx(ctx: {
  db: { _type: "db"; client: any };
  user: { userId: string; email: string; handle: string };
}): AuthedContext {
  return { _type: "authed", db: ctx.db, user: ctx.user };
}

export const nodeQuizRouter = router({
  getQuiz: protectedProcedure
    .input(z.object({ knowledgeGraphNodeId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        return await NodeQuizService.getOrCreateQuiz.execute(
          toAuthedCtx(ctx),
          { ...input, generateQuizQuestions },
        );
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Not authorized") {
            throw new TRPCError({ code: "FORBIDDEN", message: error.message });
          }
          if (error.message.includes("locked")) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: error.message,
            });
          }
        }
        throw error;
      }
    }),

  submitQuiz: protectedProcedure
    .input(
      z.object({
        knowledgeGraphNodeId: z.string().min(1),
        quizId: z.string().min(1),
        selectedAnswers: z.array(z.number().int().min(0)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await NodeQuizService.submitQuiz.execute(
          toAuthedCtx(ctx),
          input,
        );
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Not authorized") {
            throw new TRPCError({ code: "FORBIDDEN", message: error.message });
          }
          if (
            error.message.includes("not found") ||
            error.message.includes("Must answer")
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: error.message,
            });
          }
        }
        throw error;
      }
    }),
});
