import type { UnauthedContext } from "@lurnt/domain";
import { findUserProfileByHandle } from "@lurnt/data-access";

export async function getProfile(
  ctx: UnauthedContext,
  input: { handle: string },
) {
  const profile = await findUserProfileByHandle(ctx, input.handle);

  if (!profile) {
    throw new Error("User not found");
  }

  return profile;
}
