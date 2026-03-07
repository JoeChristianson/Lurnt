import { withTx } from "@lurnt/domain";
import type { AuthedContext } from "@lurnt/domain";
import { updateUserTheme } from "@lurnt/data-access";

const VALID_THEMES = [
  "warm-literary",
  "ink-paper",
  "dark-moody",
  "earth-tones",
] as const;

export async function updateTheme(
  ctx: AuthedContext,
  input: { theme: string },
) {
  return withTx(ctx, async (txCtx) => {
    const themeValue = VALID_THEMES.includes(
      input.theme as (typeof VALID_THEMES)[number],
    )
      ? input.theme
      : null;

    await updateUserTheme(txCtx, txCtx.user.userId, themeValue);

    return { success: true, theme: themeValue };
  });
}
