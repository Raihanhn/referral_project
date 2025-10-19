// lib/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

// Extend the default Session interface to include user.id
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // add the user ID
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}
