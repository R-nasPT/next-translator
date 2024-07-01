"use client";

import { Link, usePathname, useRouter } from "@/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale() //<-- เช็คภาษาของ browser

  return (
    <div className="flex gap-3">
      <h1>{locale.toUpperCase()}</h1>
      <Link href={`${pathname}`} locale="th">TH</Link>
      <Link href={`${pathname}`} locale="en">EN</Link>
    </div>
  );
}
