import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@new-tab-ai/web/src/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();
