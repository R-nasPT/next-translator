import { BACK_URLS, HEADER_TITLES } from "@/constants";
import { IoIosArrowBack } from "@/lib/icons";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

interface HeaderNavProps {
  isScrolled: boolean;
}

export default function HeaderNav({ isScrolled }: HeaderNavProps) {
  const t = useTranslations();
  const pathName = usePathname();

  return (
    <nav
      className={`sticky top-0 pt-10 pb-8 z-40 lg:pt-8 lg:pb-6 px-14 flex gap-3 items-center justify-between rounded-b-lg ${
        isScrolled ? "bg-white shadow-xl" : "bg-transparent"
      }`}
    >
      <Link
        href={BACK_URLS[pathName]}
        className="flex items-center gap-2 text-[22px] text-midnight-indigo hover:bg-gray-100 p-1 rounded-xl transition-colors duration-300"
      >
        <IoIosArrowBack className="w-5 h-5" /> {t("BUTTON.BACK")}
      </Link>
      <h1 className="text-2xl font-semibold text-midnight-indigo">
        {t(`HEADER_NAV.${HEADER_TITLES[pathName]}`)}
      </h1>
      <div className="w-[150px] hidden md:block"></div>
    </nav>
  );
}
