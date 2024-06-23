"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useTranslation } from "../../i18n/client";

interface ClientProps {
  params: {
    lng: string;
  };
}

export default function ClientPage(props: ClientProps) {
  const {
    params: { lng },
  } = props;
  const { t } = useTranslation(lng, "pagetwo");

  // ใส่ useEffect และ use client เพื่อจำลองว่าเป็น client site
  useEffect(() => {}, []);

  return (
    <>
      <h1>{t("clientPage")}</h1>
      <div>
        <Link href={`/${lng}/profile`}>{t("gotoProfile")}</Link>
      </div>
      <div>
        <Link href={`/${lng}`}>{t("gotoHome")}</Link>
      </div>
    </>
  );
}
