import { initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const createContext = async () => {
    const session = await getServerSession(authOptions);
    return {
        session,
    };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
    if (!opts.ctx.session || !opts.ctx.session.user) {
        throw new Error("Unauthorized");
    }
    return opts.next({
        ctx: {
            session: opts.ctx.session,
        },
    });
});
