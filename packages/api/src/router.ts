import { router, publicProcedure } from "./server";
import { userRouter } from "./routers/user";
import { getDb } from "@lurnt/database";

export const appRouter = router({
  user: userRouter,
  ping: publicProcedure.query(async () => {
    try {
      await getDb();
      return { status: "ok", db: "connected" };
    } catch {
      return { status: "ok", db: "disconnected" };
    }
  }),
});

export type AppRouter = typeof appRouter;
