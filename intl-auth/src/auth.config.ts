import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const credentialsConfig = CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const user = {
      id: "123",
      name: "qwerty",
      email: "qwerty@Qwigley.com",
      password: "1234",
      role: "user-3",
    };
    if (
      credentials?.email === user.email &&
      credentials?.password === user.password
    ) {
      return user;
    } else return null;
  },
});

export default {
  providers: [credentialsConfig],
} satisfies NextAuthConfig;
