import { unstable_setRequestLocale } from 'next-intl/server';

export function withLocale(Component: React.ComponentType<any>) {
  return function LocaleWrapper({ params: { locale }, ...props }: { params: { locale: string } }) {
    unstable_setRequestLocale(locale);
    return <Component {...props} />;
  };
}
