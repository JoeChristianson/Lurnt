import { router, publicProcedure } from "./server";
import { userRouter } from "./routers/user";
import { itemsRouter } from "./routers/items";
import { getDb } from "@lurnt/database";

export const appRouter = router({
  user: userRouter,
  items: itemsRouter,
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
