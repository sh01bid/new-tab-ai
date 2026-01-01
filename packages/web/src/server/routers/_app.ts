import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { chatRouter } from "./chat";

export const appRouter = router({
    hello: publicProcedure
        .input(z.object({ text: z.string() }))
        .query(({ input }) => {
            return {
                greeting: `Hello ${input.text}`,
            };
        }),
    chat: chatRouter,
});

export type AppRouter = typeof appRouter;
