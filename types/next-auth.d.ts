import NextAuth from "next-auth";

// extending the Session interface to include the database ID for the user that we're adding via the authOptions
// callbacks functions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
