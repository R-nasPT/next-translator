import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    token: string;
    id: string;
    name: string;
    roles: string[];
    authMethod: string;
    accountId?: string;
    iat: number;
    exp: number;
  }

  interface Session {
    user:  Omit<User, 'email' | 'image'>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}
