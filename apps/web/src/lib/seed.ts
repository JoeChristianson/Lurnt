import dotenv from "dotenv";
import path from "path";
import { getDb } from "@lurnt/database";
import { UserService } from "@lurnt/domain-services";
import type { UnauthedContext } from "@lurnt/domain";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

async function seed() {
  console.log("Starting seed...");

  const db = await getDb();
  const ctx: UnauthedContext = {
    _type: "unauthed",
    db: { _type: "db", client: db } as any,
  };

  // --- 1. Dev user ---
  const email = process.env.BOT_EMAIL ?? "dev@example.com";
  const handle = process.env.BOT_USERNAME ?? "dev";
  const password = process.env.BOT_PASSWORD ?? "password123";

  console.log(`Seeding dev user: ${handle} (${email})`);
  const userResult = await UserService.planter.execute(ctx, {
    email,
    handle,
    password,
  });
  console.log(
    userResult.created
      ? `  Created dev user: ${userResult.id}`
      : `  Updated existing dev user: ${userResult.id}`,
  );

  // --- Done ---
  console.log("\nSeed complete!");
  console.log(`\nLogin with:\n  Email: ${email}\n  Password: ${password}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
