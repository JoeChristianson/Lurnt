import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    console.error("tRPC Error:", {
      code: shape.code,
      message: shape.message,
      path: shape.data?.path,
      cause: error.cause instanceof Error ? error.cause.message : error.cause,
    });
    return shape;
  },
});

type AuthedContext = {
  user: { userId: string; email: string; handle: string };
  logger: Context["logger"];
};

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!ctx.user.handle) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Handle required. Complete your profile first.",
    });
  }
  return next({
    ctx: {
      user: ctx.user as AuthedContext["user"],
      logger: ctx.logger,
    },
  });
});

type PartialAuthedContext = {
  user: { userId: string; email: string; handle: string | null };
  logger: Context["logger"];
};

const isPartialAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
      logger: ctx.logger,
    } as PartialAuthedContext,
  });
});

const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  if (!ctx.user.handle) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Handle required. Complete your profile first.",
    });
  }
  if (!Boolean(ctx.user.isAdmin)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required.",
    });
  }
  return next({
    ctx: {
      user: ctx.user as AuthedContext["user"],
      logger: ctx.logger,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const partialProtectedProcedure = t.procedure.use(isPartialAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
