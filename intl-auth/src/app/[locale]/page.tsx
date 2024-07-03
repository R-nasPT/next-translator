import Login from "@/components/auth/login";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("INDEX");
  return (
    <>
      <Login />
    </>
  );
}
