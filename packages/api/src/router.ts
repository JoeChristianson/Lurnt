import { router, publicProcedure } from "./server";
import { userRouter } from "./routers/user";
import { expertiseRouter } from "./routers/expertise";
import { assessmentRouter } from "./routers/assessment";
import { knowledgeGraphRouter } from "./routers/knowledgeGraph";
import { getDb } from "@lurnt/database";

export const appRouter = router({
  user: userRouter,
  expertise: expertiseRouter,
  assessment: assessmentRouter,
  knowledgeGraph: knowledgeGraphRouter,
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
