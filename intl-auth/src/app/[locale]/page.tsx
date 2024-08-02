import Login from "@/components/auth/login";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function RootPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string };
}) {
  // const t = await getTranslations("INDEX");
  if (!searchParams.page || searchParams.page !== "login") {
    redirect(`/${params.locale}/?page=login`);
  }

  return (
    <>
      <Login />
    </>
  );
}
