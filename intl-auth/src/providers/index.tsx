import { NextIntlClientProvider } from "next-intl";
import ReactQueryProvider from "./ReactQueryProvider";
import SessionProvider from "./SessionProvider";
import { getMessages } from "next-intl/server";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
}

export default async function Providers({ children, locale }: ProvidersProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SessionProvider>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}
