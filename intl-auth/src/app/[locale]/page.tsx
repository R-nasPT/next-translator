import Login from '@/features/auth/components/Login';

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

const getCallbackUrl = (callbackUrlParam?: string): string => {
  if (!callbackUrlParam) return '/dashboard';

  try {
    const decodedUrl = decodeURIComponent(callbackUrlParam);

    if (decodedUrl.startsWith('/')) {
      return decodedUrl;
    }

    if (typeof window !== 'undefined') {
      const url = new URL(decodedUrl, window.location.origin);
      return url.origin === window.location.origin ? decodedUrl : '/dashboard';
    }

    return '/dashboard';
  } catch {
    return '/dashboard';
  }
};

export default async function RootPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = getCallbackUrl(params.callbackUrl);
  return <Login callbackUrl={callbackUrl} />;
}
