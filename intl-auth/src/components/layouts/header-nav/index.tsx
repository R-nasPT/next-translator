import { headerTitles } from "@/constants";
import { IoIosArrowBack, MdMenu } from "@/libs/icons";
import { usePathname, useRouter } from "@/navigation";
import { cn } from "@/utils";
import { useTranslations } from "next-intl";

interface HeaderNavProps {
  isScrolled: boolean;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function HeaderNav({ isScrolled, onMenuClick, isSidebarOpen }: HeaderNavProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <nav
      className={`sticky top-0 pt-10 pb-8 z-40 lg:pt-8 lg:pb-6 px-14 flex gap-3 items-center justify-between rounded-b-lg ${
        isScrolled ? "bg-white shadow-xl" : "bg-transparent"
      }`}
    >
      <button
        onClick={onMenuClick}
        className={cn(
          `absolute bg-white left-0 top-5 p-2 rounded-r-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] focus:outline-none transition-all duration-300`,
          isSidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <MdMenu className="w-6 h-6" />
      </button>
      <button
        className="flex items-center gap-2 text-[22px] text-[#280d5f] hover:bg-gray-100 p-1 rounded-xl transition-colors duration-300"
        onClick={() => router.back()}
      >
        <IoIosArrowBack className="w-5 h-5" /> {t("BUTTON.BACK")}
      </button>
      <h1 className="text-2xl font-semibold text-[#280d5f]">
        {t(`HEADER_NAV.${headerTitles[pathName]}`)}
      </h1>
      <div className="w-[150px] hidden md:block"></div>
    </nav>
  );
}
