import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { unstable_setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n.config";
import Providers from "@/providers";
import ClientLayout from "@/components/layouts/client-layout.tsx";
import "./globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const kanit = Kanit({ subsets: ["latin", "thai"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "ifp fulfillment",
  description: "Intelligent Fulfillment Platform",
  icons: { icon: "https://ifp.blob.core.windows.net/files/logos/000.png" },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<LocaleLayoutProps>) {
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={kanit.className}>
        <Providers locale={locale}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
