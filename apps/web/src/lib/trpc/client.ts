import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@lurnt/api";

export const trpc = createTRPCReact<AppRouter>();
