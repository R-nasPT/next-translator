"use client";

import { usePathname, useRouter } from "next/navigation";

interface LanguageSwitcherProps {
  currentLng: string;
}

export default function LanguageSwitcher({ currentLng }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (lng: string) => {
    const newPathname = pathname.replace(`/${currentLng}`, `/${lng}`);
    console.log(newPathname);
    
    router.push(newPathname);
  };

  return (
    <div className="flex gap-3">
      <button onClick={() => changeLanguage("th")}>TH</button>
      <button onClick={() => changeLanguage("en")}>EN</button>
    </div>
  );
}
