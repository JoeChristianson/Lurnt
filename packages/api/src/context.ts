import { verifyToken } from "./auth";
import { createLogger, type Logger } from "@lurnt/utils";
import { getDb, users } from "@lurnt/database";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import type { DbClient } from "@lurnt/domain";

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim()).filter(Boolean);

export type Context = {
  db: DbClient;
  user: { userId: string; email: string; handle: string | null; isAdmin: number } | null;
  logger: Logger;
  ip: string;
};

export async function createContext(req: Request): Promise<Context> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const logger = createLogger();
  const userToken = token ? verifyToken(token) : null;

  const rawDb = await getDb();
  const db: DbClient = { _type: "db", client: rawDb };

  let user = null;
  if (userToken?.userId) {
    const result = await rawDb
      .select({
        id: users.id,
        email: users.email,
        handle: users.handle,
        isAdmin: users.isAdmin,
      })
      .from(users)
      .where(eq(users.id, userToken.userId));

    user = result[0]
      ? {
          userId: result[0].id,
          email: result[0].email,
          handle: result[0].handle,
          isAdmin:
            Boolean(result[0].isAdmin) ||
            ADMIN_EMAILS.includes(result[0].email)
              ? 1
              : 0,
        }
      : null;
  }

  const ip = req.headers.get("x-forwarded-for")
    ? String(req.headers.get("x-forwarded-for")).split(",")[0].trim()
    : "unknown";

  return { db, user, logger, ip };
}
