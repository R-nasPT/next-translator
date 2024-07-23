import Login from "@/components/auth/login";
import { getTranslations } from "next-intl/server";
import { withLocale } from '@/utils/withLocale';

async function Home() {
  const t = await getTranslations("INDEX");
  return (
    <>
      <Login />
    </>
  );
}

export default withLocale(Home);
