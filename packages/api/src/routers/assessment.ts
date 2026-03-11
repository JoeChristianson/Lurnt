import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../server";
import { AssessmentService } from "@lurnt/domain-services";
import {
  continueIntakeConversation,
  generateIntakeSummary,
} from "@lurnt/ai";
import type { AuthedContext } from "@lurnt/domain";

function toAuthedCtx(ctx: {
  db: { _type: "db"; client: any };
  user: { userId: string; email: string; handle: string };
}): AuthedContext {
  return { _type: "authed", db: ctx.db, user: ctx.user };
}

export const assessmentRouter = router({
  getConversation: protectedProcedure
    .input(z.object({ userExpertiseId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      try {
        return await AssessmentService.getConversation.execute(
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

  startIntake: protectedProcedure
    .input(z.object({ userExpertiseId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await AssessmentService.startIntake.execute(
          toAuthedCtx(ctx),
          { ...input, continueIntakeConversation },
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authorized") {
          throw new TRPCError({ code: "FORBIDDEN", message: error.message });
        }
        throw error;
      }
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        userExpertiseId: z.string().min(1),
        message: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await AssessmentService.sendMessage.execute(
          toAuthedCtx(ctx),
          { ...input, continueIntakeConversation },
        );
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Not authorized") {
            throw new TRPCError({ code: "FORBIDDEN", message: error.message });
          }
          if (error.message.includes("already completed")) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: error.message,
            });
          }
        }
        throw error;
      }
    }),

  completeIntake: protectedProcedure
    .input(z.object({ userExpertiseId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await AssessmentService.completeIntake.execute(
          toAuthedCtx(ctx),
          { ...input, generateIntakeSummary },
        );
      } catch (error) {
        if (error instanceof Error && error.message === "Not authorized") {
          throw new TRPCError({ code: "FORBIDDEN", message: error.message });
        }
        throw error;
      }
    }),
});
