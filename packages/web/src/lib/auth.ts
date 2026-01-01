import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    session: {
        strategy: "database",
    },
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
};
