import prisma from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                try {
                    const user = await prisma.user.upsert({
                        where: { email: credentials.email },
                        update: {},
                        create: {
                            email: credentials.email,
                            name: credentials.email.split('@')[0],
                        },
                    });
                    return user;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        session: async ({ session, token }: any) => {
            if (session?.user) {
                const userId = token.sub || token.uid;
                session.user.id = userId;
                session.user.isSubscribed = Boolean(token.isSubscribed);
            }
            return session;
        },
        jwt: async ({ user, token }: any) => {
            if (user) {
                token.uid = user.id;
                token.isSubscribed = Boolean(user.isSubscribed);
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/login', // Redirect errors back to login
    },
    session: {
        strategy: "jwt",
    },
} as any;
