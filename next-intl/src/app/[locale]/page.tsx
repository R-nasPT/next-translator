import Switcher from "@/components/switcher";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Index");
  return (
    <>
      <h1>{t("title")}</h1>
      <Switcher />
    </>
  );
}
