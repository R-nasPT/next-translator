import { useTranslation } from "@/app/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";

interface ProfileProps {
  params: {
    lng: string;
  };
}

export default async function ProfilePage({ params: { lng } }: ProfileProps) {
    const { t } = await useTranslation(lng, "profile");
  return (
    <>
      <h1>หน้าโปรไฟล์</h1>
      <Link href={`/${lng}`}>{t("gotoHome")}</Link>
      <LanguageSwitcher currentLng={lng} />
    </>
  );
}
