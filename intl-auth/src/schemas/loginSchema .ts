import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "REQUIRE_EMAIL" }),
  password: z.string().min(1, 'REQUIRE_PASSWORD'),
});

