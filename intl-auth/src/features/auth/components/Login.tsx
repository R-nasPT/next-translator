'use client';

import type { z } from 'zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { LoadingIcon } from '@/lib/icons';
import { loginSchema } from '@/schemas';
import { getCurrentTheme, getEnvironmentIndicator,} from '@/config/theme-config';
import { useAnalytics } from '@/hooks';
import { useRouter } from '@/navigation';
import AuthInputField from './auth-input-field';

type FormData = z.infer<typeof loginSchema>;

interface LoginProps {
  callbackUrl: string;
}

export default function Login({ callbackUrl }: LoginProps) {
  const [errorMsg, setErrorMsg] = useState('');
  const [isKeycloakLoading, setIsKeycloakLoading] = useState(false);

  const t = useTranslations();
  const router = useRouter();
  const theme = getCurrentTheme();
  const envIndicator = getEnvironmentIndicator();

  const { track } = useAnalytics();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onHandleSubmit: SubmitHandler<FormData> = async (data) => {
    setErrorMsg('');
    const result = await signIn('credentials', {
      email: data.emailOrUsername,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setErrorMsg(t('ERROR_MESSAGE.LOGIN_FAIL'));
    } else if (result?.ok) {
      localStorage.removeItem('is_signing_out');
      track('session_initialized');
      router.replace(callbackUrl);
    }
  };

  const handleKeycloakLogin = async () => {
    setIsKeycloakLoading(true);
    setErrorMsg('');
    
    try {
      await signIn('keycloak', {
        kc_idp_hint: 'microsoft',
        callbackUrl,
      });
      localStorage.removeItem('is_signing_out');
      track('session_initialized');
    } catch (error) {
      console.error('Keycloak login exception:', error);
      setErrorMsg('ไม่สามารถเข้าสู่ระบบด้วย Microsoft ได้ กรุณาลองใหม่อีกครั้ง');
      setIsKeycloakLoading(false);
    }
  };

  return (
    <main
      className={`relative h-screen items-center justify-center lg:flex ${theme.login.bg}`}
    >
      {envIndicator.show && (
        <div className="fixed top-0 left-0 z-50 flex w-full justify-center">
          <div
            className={`${envIndicator.badgeColor} ${envIndicator.textColor} animate-pulse rounded-b-lg px-4 py-1 text-xs font-medium shadow-lg`}
          >
            {envIndicator.shortName} ENVIRONMENT
          </div>
        </div>
      )}

      {envIndicator.show && (
        <div className="absolute top-4 right-4 z-40 cursor-default">
          <div
            className={`${envIndicator.badgeColor} ${envIndicator.textColor} transform rounded-full px-3 py-1 text-xs font-medium shadow-md transition-transform hover:scale-110`}
          >
            {envIndicator.fullName}
          </div>
        </div>
      )}
      <section
        className={`h-full overflow-hidden bg-white md:rounded-3xl lg:flex lg:h-5/6 lg:w-[70%] ${theme.login.shadow}`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-1 md:px-20 lg:w-3/4 lg:px-0">
          <h1
            className={`relative text-3xl font-bold text-wrap ${theme.login.title}`}
          >
            {t('INDEX.HELLO')}
            <span className="absolute -bottom-1 left-4 h-1 w-1/2 rounded-sm bg-linear-to-r from-transparent to-current opacity-30" />
          </h1>
          <p className="text-base text-[#575757]">
            {t('INDEX.LOGIN_SUB')}
          </p>

          <div className="my-3 w-full px-10 lg:px-20">
            <button
              onClick={handleKeycloakLogin}
              disabled={isKeycloakLoading}
              className={`relative flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-4 text-sm font-medium transition-smooth md:mx-auto md:w-2/3 ${
                isKeycloakLoading
                  ? 'cursor-default bg-blue-300 text-white opacity-40'
                  : 'cursor-pointer border-0 bg-[#2563eb] text-white shadow-md hover:bg-[#1d4ed8] hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {isKeycloakLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-800"/>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 23 23" className="flex-shrink-0">
                    <rect x="1" y="1" width="10" height="10" fill="#ffffff" rx="0.5"/>
                    <rect x="12" y="1" width="10" height="10" fill="#ffffff" rx="0.5" fillOpacity="0.9"/>
                    <rect x="1" y="12" width="10" height="10" fill="#ffffff" rx="0.5" fillOpacity="0.9"/>
                    <rect x="12" y="12" width="10" height="10" fill="#ffffff" rx="0.5" fillOpacity="0.8"/>
                  </svg>
                  {/* <svg width="16" height="16" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                  </svg> */}
                  <span className="font-medium">เข้าสู่ระบบด้วย Microsoft</span>
                </>
              )}
            </button>
          </div>

          <div className="my-2 flex w-full items-center px-10 lg:px-20">
            <div className="h-px flex-1 bg-gray-200"/>
            <span className="px-3 text-xs text-gray-400">หรือ</span>
            <div className="h-px flex-1 bg-gray-200"/>
          </div>

          <form
            className="flex w-full flex-col gap-3 px-10 lg:px-20"
            onSubmit={handleSubmit(onHandleSubmit)}
          >
            <AuthInputField
              type="text"
              placeholder="E-mail or Username"
              name="emailOrUsername"
              register={register}
              error={errors.emailOrUsername?.message}
            />
            <AuthInputField
              type="password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              name="password"
              register={register}
              error={errors.password?.message}
            />
            {errorMsg && (
              <p className="text-center text-sm text-red-500">{errorMsg}</p>
            )}
            <div className="flex w-full justify-center">
              <button
                className={`flex w-full items-center justify-center bg-linear-to-r bg-size-[200%_100%] py-3 md:w-1/2 ${
                  theme.login.button
                } rounded-full bg-left text-white transition-all duration-500 ease-in-out ${
                  isSubmitting
                    ? 'cursor-default opacity-30'
                    : 'cursor-pointer hover:bg-right active:scale-[0.98]'
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <LoadingIcon className="me-2 inline h-4 w-4 animate-spin text-white" />
                )}
                {isSubmitting ? `${t('INDEX.SIGN_IN')}...` : t('INDEX.SIGN_IN')}
              </button>
            </div>
          </form>

          <p className="mt-3 text-sm text-[#c7c6cc]">
            {t('INDEX.FORGET_PASSWORD')}
          </p>
        </div>
        <article
          className={`hidden w-1/2 flex-col items-center justify-center gap-5 bg-linear-to-b lg:flex ${theme.login.article} relative overflow-hidden p-10 text-center text-white`}
        >
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white opacity-10" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white opacity-5" />

          <h1 className="relative z-10 text-3xl font-semibold">
            {t('INDEX.WELCOME')}
            <div className="mx-auto mt-1 h-1 w-16 rounded-full bg-white opacity-50" />
          </h1>
          <p className="relative z-10 text-lg font-medium">
            Intelligent Fulfillment Platform
          </p>
          <p className="relative z-10 max-w-xs">
            {t('INDEX.LOGIN_DESCRIPTION')}
          </p>

          <div className="absolute right-0 bottom-4 left-0 text-center">
            <div className="text-xs opacity-70">
              © {new Date().getFullYear()} Warehouse - Siam Outlet{' '}
              {envIndicator.show && ` (${envIndicator.shortName})`}
            </div>
          </div>
        </article>
      </section>

      <div className="pointer-events-none fixed top-0 left-0 z-0 h-full w-full">
        <div className="absolute top-0 right-0 h-1/3 w-1/3 rounded-bl-full bg-linear-to-b from-indigo-100 to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 h-1/4 w-1/4 rounded-tr-full bg-linear-to-t from-indigo-100 to-transparent opacity-30" />
      </div>
    </main>
  );
}
