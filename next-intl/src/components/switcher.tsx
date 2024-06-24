"use client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useTransition } from "react";

export default function Switcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();

  const onSelectChang = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(`${nextLocale}`);
    });
  };

  return (
    <label className="border-2 rounded">
      <p className="sr-only">Chang language</p>
      <select
        defaultValue={localActive}
        className="bg-transparent py-2"
        onChange={onSelectChang}
        disabled={isPending}
      >
        <option value="en">English</option>
        <option value="th">Thai</option>
      </select>
    </label>
  );
}
