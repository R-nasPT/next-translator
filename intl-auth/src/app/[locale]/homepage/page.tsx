"use client";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Link } from "@/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
    const t = useTranslations('INDEX')
  const { data: session } = useSession();
  // console.log(session);

  return (
    <>
      <h1>{t("HOMEPAGE")}</h1>
      <p>ID : {session?.user?.id}</p>
      <p>Email : {session?.user?.email}</p>
      <p>Name : {session?.user?.name}</p>
      <p>Role : {(session?.user as any)?.role}</p>
      <Link href={`/`}>{t("GO_TO_ROOTPAGE")}</Link>
      <br />
      <button className="bg-red-400 text-white p-3 rounded-md" onClick={() => signOut()}>Log Out</button>
      <br />
      <LanguageSwitcher />
    </>
  );
}
