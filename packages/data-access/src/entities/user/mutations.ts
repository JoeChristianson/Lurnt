import { users } from "@lurnt/database";
import { eq } from "drizzle-orm";
import type { ServiceContext } from "@lurnt/domain";

export async function setEmailVerificationToken(
  ctx: ServiceContext,
  userId: string,
  token: string,
  expiresAt: Date,
) {
  await ctx.db.client
    .update(users)
    .set({
      emailVerificationToken: token,
      emailVerificationExpiresAt: expiresAt,
    })
    .where(eq(users.id, userId));
}

export async function markEmailVerified(ctx: ServiceContext, userId: string) {
  await ctx.db.client
    .update(users)
    .set({
      emailVerified: 1,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
    })
    .where(eq(users.id, userId));
}

export async function upsertUser(
  ctx: ServiceContext,
  data: {
    id: string;
    email: string;
    handle: string;
    passwordHash: string;
  },
) {
  const existing = await ctx.db.client
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (existing[0]) {
    await ctx.db.client
      .update(users)
      .set({
        handle: data.handle,
        passwordHash: data.passwordHash,
      })
      .where(eq(users.id, existing[0].id));
    return { id: existing[0].id, created: false };
  }

  await ctx.db.client.insert(users).values({
    id: data.id,
    email: data.email,
    handle: data.handle,
    passwordHash: data.passwordHash,
    emailVerified: 1,
  });
  return { id: data.id, created: true };
}

export async function createOAuthUser(
  ctx: ServiceContext,
  data: {
    id: string;
    email: string;
    googleId: string;
  },
) {
  await ctx.db.client.insert(users).values({
    id: data.id,
    email: data.email,
    googleId: data.googleId,
    emailVerified: 1,
  });
}

export async function linkGoogleId(
  ctx: ServiceContext,
  userId: string,
  googleId: string,
) {
  await ctx.db.client
    .update(users)
    .set({ googleId })
    .where(eq(users.id, userId));
}

export async function setUserHandle(
  ctx: ServiceContext,
  userId: string,
  handle: string,
) {
  await ctx.db.client
    .update(users)
    .set({ handle })
    .where(eq(users.id, userId));
}

export async function updateUserTheme(
  ctx: ServiceContext,
  userId: string,
  theme: string | null,
) {
  await ctx.db.client
    .update(users)
    .set({ theme })
    .where(eq(users.id, userId));
}

export async function updateUserProfile(
  ctx: ServiceContext,
  userId: string,
  data: {
    bio: string | null;
    websiteUrl: string | null;
    socialLinks: Record<string, string | undefined> | null;
  },
) {
  await ctx.db.client
    .update(users)
    .set({
      bio: data.bio,
      websiteUrl: data.websiteUrl,
      socialLinks: data.socialLinks,
    })
    .where(eq(users.id, userId));
}
