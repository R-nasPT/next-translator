import { useOutsideClick } from "@/hooks";
import { Link, usePathname } from "@/navigation";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { MdDomain, MdKeyboardArrowDown, MdLockReset, CgLogOut, SiVitest } from "@/lib/icons";

export default function MenuButton() {
  const pathname = usePathname();
  const locale = useLocale();
  const { ref, isOpen, toggleOpen } = useOutsideClick();

  return (
    <div className="px-2 pb-3 relative" ref={ref}>
      <button
        className="flex justify-between items-center bg-[#faf9fa] w-full px-5 py-4 text-midnight-indigo text-sm font-semibold rounded-full"
        onClick={toggleOpen}
      >
        SiamOutlet{" "}
        <MdKeyboardArrowDown
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute z-50 bg-white left-7 py-3 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] w-60 text-midnight-indigo text-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <ul>
          <li className="flex items-center gap-5 py-3 px-6 hover:bg-gray-100 cursor-pointer">
            <MdDomain className="w-7 h-7 text-[#783cf1]" />
            <h1>Siam Outlet</h1>
          </li>
          <li className="flex items-center gap-5 py-3 px-6 hover:bg-gray-100 cursor-pointer">
            <SiVitest className="w-7 h-7 text-[#783cf1]" />
            <h1>Test_Siam Outlet</h1>
          </li>
        </ul>
        <hr className="my-2" />
        <ul className="flex flex-col py-2">
          <p className="text-sm text-lavender-mist pb-2 px-6">LANGUAGE</p>
          <Link
            href={pathname}
            locale="th"
            className={`py-3 px-6 ${
              locale === "th"
                ? "bg-[#7645D914] hover:bg-[#7645d91e]"
                : "hover:bg-gray-100"
            }`}
          >
            ภาษาไทย
          </Link>
          <Link
            href={pathname}
            locale="en"
            className={`py-3 px-6 ${
              locale === "en"
                ? "bg-[#7645D914] hover:bg-[#7645d91e]"
                : "hover:bg-gray-100"
            }`}
          >
            English
          </Link>
        </ul>
        <hr className="my-2" />
        <ul>
          <li className="flex items-center gap-5 py-3 px-6 hover:bg-gray-100 cursor-pointer">
            <MdLockReset className="w-7 h-7 text-lavender-mist" />
            <h1 className="text-lavender-mist">Change Password</h1>
          </li>
          <li
            className="flex items-center gap-5 text-[#c00000] py-3 px-6 hover:bg-gray-100 cursor-pointer"
            onClick={() => signOut()}
          >
            <CgLogOut className="w-7 h-7" />
            <h1>Log Out</h1>
          </li>
        </ul>
      </div>
    </div>
  );
}
