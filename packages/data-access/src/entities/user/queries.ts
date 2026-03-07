import { users } from "@lurnt/database";
import { eq, and, gt } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function findUserById(ctx: ServiceContext, userId: string) {
  const result = await ctx.db.client
    .select({
      id: users.id,
      email: users.email,
      handle: users.handle,
      emailVerified: users.emailVerified,
      termsAcceptedAt: users.termsAcceptedAt,
      createdAt: users.createdAt,
      theme: users.theme,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function findUserByEmail(ctx: ServiceContext, email: string) {
  const result = await ctx.db.client
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] ?? null;
}

export async function findUserByVerificationToken(
  ctx: ServiceContext,
  token: string,
) {
  const result = await ctx.db.client
    .select({
      id: users.id,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(
      and(
        eq(users.emailVerificationToken, token),
        gt(users.emailVerificationExpiresAt, new Date()),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function findUserProfileByHandle(
  ctx: ServiceContext,
  handle: string,
) {
  const result = await ctx.db.client
    .select({
      id: users.id,
      handle: users.handle,
      bio: users.bio,
      websiteUrl: users.websiteUrl,
      socialLinks: users.socialLinks,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.handle, handle))
    .limit(1);

  return result[0] ?? null;
}

export async function findUserByGoogleId(
  ctx: ServiceContext,
  googleId: string,
) {
  const result = await ctx.db.client
    .select()
    .from(users)
    .where(eq(users.googleId, googleId))
    .limit(1);

  return result[0] ?? null;
}

export async function findUserByHandle(
  ctx: ServiceContext,
  handle: string,
) {
  const result = await ctx.db.client
    .select({ id: users.id })
    .from(users)
    .where(eq(users.handle, handle))
    .limit(1);

  return result[0] ?? null;
}

export async function findUserProfileById(
  ctx: ServiceContext,
  userId: string,
) {
  const result = await ctx.db.client
    .select({
      bio: users.bio,
      websiteUrl: users.websiteUrl,
      socialLinks: users.socialLinks,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0] ?? null;
}
