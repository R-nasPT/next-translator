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

type FormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const tErr = useTranslations("ERROR_MESSAGE");
  const t = useTranslations("INDEX");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
              src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyE19FzcWoN9taTpsvvjmWhc07WzAy2sMuCQ&s`}
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
              Aetificial Interlligence giving you travel recommendations
            </h1>
            <p className="text-base text-[#58745E] py-3">{t("WELCOME")}</p>
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(onHandleSubmit)}
            >
              <label htmlFor="email">
                <h1 className="font-semibold text-base">Email</h1>
                <input
                  className="border border-[#B8D6BF] p-3 rounded-md w-full text-base text-[#355B3E] placeholder:text-[#B8D6BF] focus:outline-[#355B3E]"
                  type="text"
                  placeholder="example@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {tErr(errors.email?.message)}
                  </p>
                )}
              </label>
              <label htmlFor="password">
                <h1 className="font-semibold text-base">Password</h1>
                <input
                  className="border border-[#B8D6BF] p-3 rounded-md w-full text-base text-[#355B3E] placeholder:text-[#B8D6BF] focus:outline-[#355B3E]"
                  type="password"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {tErr(errors.password?.message)}
                  </p>
                )}
              </label>
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">
                  {tErr(errorMsg)}
                </p>
              )}
              <h1 className="text-right text-[#355B3E] underline">
                Forgot password?
              </h1>
              <button className="bg-[#029664] hover:bg-[#029665d2] transition-colors duration-300 text-white rounded-md py-4 w-full">
                Login
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
