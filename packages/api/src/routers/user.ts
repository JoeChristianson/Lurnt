import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  router,
  publicProcedure,
  protectedProcedure,
  partialProtectedProcedure,
} from "../server";
import { getDb, users } from "@lurnt/database";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { hashPassword, verifyPassword, generateToken } from "../auth";
import { ADMIN_EMAILS } from "../context";
import { UserService } from "@lurnt/domain-services";
import { getEmailService } from "../email";
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

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        handle: z.string().min(3).max(255),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();

      const existingEmail = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1)
        .then((res) => res[0]?.email);

      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      const existingHandle = await db
        .select({ handle: users.handle })
        .from(users)
        .where(eq(users.handle, input.handle))
        .limit(1)
        .then((res) => res[0]?.handle);

      if (existingHandle) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Handle already exists",
        });
      }

      const passwordHash = await hashPassword(input.password);

      const userId = createId();
      await db.insert(users).values({
        id: userId,
        email: input.email,
        handle: input.handle,
        passwordHash,
      });

      await UserService.sendVerificationEmail.execute(toUnauthedCtx(ctx), {
        userId,
        email: input.email,
        handle: input.handle,
        emailService: getEmailService(),
      });

      const token = generateToken(userId);
      return { token };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const db = await getDb();

      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1)
        .then((res) => res[0]);

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const isValid = await verifyPassword(input.password, user.passwordHash);

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = generateToken(user.id);
      return { token };
    }),

  acceptTerms: partialProtectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    await db
      .update(users)
      .set({ termsAcceptedAt: new Date() })
      .where(eq(users.id, ctx.user.userId));
    return { success: true };
  }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await UserService.verifyEmail.execute(
          toUnauthedCtx(ctx),
          input,
        );
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification token",
        });
      }
    }),

  resendVerification: protectedProcedure.mutation(async ({ ctx }) => {
    return UserService.resendVerification.execute(toAuthedCtx(ctx), {
      emailService: getEmailService(),
    });
  }),

  me: partialProtectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();

    const user = await db
      .select({
        id: users.id,
        email: users.email,
        handle: users.handle,
        emailVerified: users.emailVerified,
        termsAcceptedAt: users.termsAcceptedAt,
        createdAt: users.createdAt,
        bio: users.bio,
        websiteUrl: users.websiteUrl,
        socialLinks: users.socialLinks,
        theme: users.theme,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.id, ctx.user.userId))
      .limit(1)
      .then((res) => res[0]);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return {
      ...user,
      isAdmin:
        Boolean(user.isAdmin) || ADMIN_EMAILS.includes(user.email) ? 1 : 0,
    };
  }),

  getProfile: publicProcedure
    .input(z.object({ handle: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return UserService.getProfile.execute(toUnauthedCtx(ctx), input);
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string().max(500).nullable().optional(),
        websiteUrl: z.string().url().max(500).nullable().optional(),
        socialLinks: z
          .object({
            twitter: z.string().url().optional(),
            instagram: z.string().url().optional(),
            bluesky: z.string().url().optional(),
            mastodon: z.string().url().optional(),
          })
          .nullable()
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return UserService.updateProfile.execute(toAuthedCtx(ctx), input);
    }),

  updateTheme: protectedProcedure
    .input(z.object({ theme: z.string().min(1).max(32) }))
    .mutation(async ({ ctx, input }) => {
      return UserService.updateTheme.execute(toAuthedCtx(ctx), input);
    }),

  loginWithGoogle: publicProcedure
    .input(z.object({ credential: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { verifyGoogleToken } = await import("../google");
      const payload = await verifyGoogleToken(input.credential);

      return UserService.loginWithGoogle.execute(toUnauthedCtx(ctx), {
        payload,
        generateToken,
      });
    }),

  setHandle: partialProtectedProcedure
    .input(z.object({ handle: z.string().min(3).max(255) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await UserService.setHandle.execute(toUnauthedCtx(ctx), {
          userId: ctx.user.userId,
          handle: input.handle,
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Handle already taken"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Handle already taken",
          });
        }
        throw error;
      }
    }),
});
