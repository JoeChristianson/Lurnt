import { withTx } from "@lurnt/domain";
import type { AuthedContext } from "@lurnt/domain";
import {
  findUserProfileById,
  updateUserProfile,
} from "@lurnt/data-access";

const MAX_BIO_LENGTH = 500;

export async function updateProfile(
  ctx: AuthedContext,
  input: {
    bio?: string | null;
    websiteUrl?: string | null;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      bluesky?: string;
      mastodon?: string;
    } | null;
  },
) {
  return withTx(ctx, async (txCtx) => {
    const existing = await findUserProfileById(
      txCtx,
      txCtx.user.userId,
    );

    if (!existing) {
      throw new Error("User not found");
    }

    const bio = input.bio !== undefined
      ? input.bio
      : existing.bio;
    const websiteUrl = input.websiteUrl !== undefined
      ? input.websiteUrl
      : existing.websiteUrl;
    const socialLinks = input.socialLinks !== undefined
      ? input.socialLinks
      : existing.socialLinks;

    if (bio && bio.length > MAX_BIO_LENGTH) {
      throw new Error(
        `Bio exceeds maximum length of ${MAX_BIO_LENGTH}`,
      );
    }

    await updateUserProfile(txCtx, txCtx.user.userId, {
      bio: bio ?? null,
      websiteUrl: websiteUrl ?? null,
      socialLinks: socialLinks ?? null,
    });

    return { success: true };
  });
}
