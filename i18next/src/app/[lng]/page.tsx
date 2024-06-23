import Link from "next/link";
import { useTranslation } from "../i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface HomeProps {
  params: {
    lng: string;
  };
}

export default async function Home({ params: { lng } }: HomeProps) {
  const { t } = await useTranslation(lng);
  return (
    <>
      <h1>หน้าแรก</h1>
      <Link href={`/${lng}/profile`}>{t("gotoProfile")}</Link>
      <LanguageSwitcher currentLng={lng} />
    </>
  );
}
