"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import mainPicture from "@/assets/login/mailPicture.svg";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema ";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "@/navigation";
import Loading from "@/assets/login/loading";
import InputField from "@/components/common/input/InputField";

type FormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const tErr = useTranslations("ERROR_MESSAGE");
  const t = useTranslations("INDEX");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: "all",
  });

  const onHandleSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setErrorMsg("LOGIN_FAIL");
      res.ok = false;
    }

    if (res?.ok) {
      router.replace(`/homepage`);
    }
  };

  return (
    <main className="md:flex md:bg-[#355b3e] justify-center items-center h-screen">
      <section className="bg-white md:flex md:rounded-2xl md:w-[80%] overflow-hidden lg:h-5/6">
        <div className="md:w-1/2">
          <header className="flex justify-center md:justify-start p-7 bg-[#355b3e] md:bg-inherit gap-5 items-center font-semibold text-white md:text-[#355B3E] text-[32px]">
            <Image
              src={`https://ifp.blob.core.windows.net/files/logos/000.png`}
              width={50}
              height={50}
              alt="logo siam outlet"
            />
            <h1>Siam Outlet</h1>
          </header>
          <Image
            src={mainPicture}
            className="h-60 w-full object-cover md:hidden"
            alt="main picture"
          />
          <div className="px-6 py-5">
            <h1 className="text-2xl font-semibold text-wrap text-[#355B3E]">
              {t("TITLE_LOGIN")}
            </h1>
            <p className="text-base text-[#58745E] py-3">{t("WELCOME")}</p>
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(onHandleSubmit)}
            >
              <InputField
                label="Email"
                type="text"
                placeholder="example@mail.com"
                name="email"
                register={register}
                error={errors.email?.message}
              />
               <InputField
                label="Password"
                type="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                name="password"
                register={register}
                error={errors.password?.message}
              />
              <button
                className="flex items-center  justify-center bg-[#029664] hover:bg-[#029665d2] transition-colors duration-300 text-white rounded-md py-4 w-full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loading />}
                {isSubmitting ? "Login..." : "Login"}
              </button>
            </form>
          </div>
        </div>
        <picture className="hidden relative md:block w-[70%]">
          <Image
            layout="fill"
            src={mainPicture}
            className="w-full h-full object-cover"
            alt="main picture"
          />
        </picture>
      </section>
    </main>
  );
}
