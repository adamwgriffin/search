import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../lib/prismadb";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the the user id to the token right after signin
      if (account) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send the user id from that database to the client. This was added to the token in the jwt() callbacka above.
      // This is accessible via the useSession() hook
      session.user.id = token.id;
      return session;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/?has_logged_out=1"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default authOptions;
