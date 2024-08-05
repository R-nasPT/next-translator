import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosInstance } from "./services/baseUrl";

const credentialsConfig = CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "email", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const res = await axiosInstance.post("/auth/backoffice/login", {
      username: credentials.email,
      password: credentials.password,
      appId: "3M1SmEH73ZLpdv0HIbU8lV",
    });

    if (res.statusText === "OK") {
      return res.data;
    }

    return null;
  },
});

export default {
  providers: [credentialsConfig],
  trustHost: true,  // กำหนดเป็น true เพื่อให้ทุก host ที่ใช้เป็นที่เชื่อถือได้
} satisfies NextAuthConfig;
