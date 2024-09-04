import { headerTitles } from "@/constants";
import { IoIosArrowBack, MdMenu } from "@/libs/icons";
import { usePathname, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

interface HeaderNavProps {
  isScrolled: boolean;
  onMenuClick: () => void;
}

export default function HeaderNav({ isScrolled, onMenuClick }: HeaderNavProps) {
  const t = useTranslations("HEADER_NAV");
  const router = useRouter();
  const pathName = usePathname();

  return (
    <nav
      className={`sticky top-0 pt-10 pb-8 z-40 lg:pt-8 lg:pb-6 px-7 flex gap-3 items-center justify-between rounded-b-lg transition-all duration-200 ${
        isScrolled ? "bg-white shadow-xl" : "bg-transparent"
      }`}
    >
      <div className="flex gap-6">
        <button onClick={onMenuClick} className="focus:outline-none">
          <MdMenu className="w-6 h-6" />
        </button>
        <button
          className="flex items-center gap-2 text-[22px] text-[#280d5f] hover:bg-gray-100 p-1 rounded-xl transition-colors duration-300"
          onClick={() => router.back()}
        >
          <IoIosArrowBack className="w-5 h-5" /> Back
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-[#280d5f]">
        {t(headerTitles[pathName])}
      </h1>
      <div className="w-[150px] hidden md:block"></div>
    </nav>
  );
}
