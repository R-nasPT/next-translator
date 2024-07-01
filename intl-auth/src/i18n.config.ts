import { LocalePrefix } from "next-intl/routing";

export const localePrefix = {
  mode: "always",
  prefixes: {
    en: "/en",
    th: "/th",
  },
} satisfies LocalePrefix<typeof locales>;

export const locales = ["en", "th"] as const;
