import useOutsideClick from "@/hooks/useOutsideClick";
import { Link, usePathname } from "@/navigation";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { CgLogOut } from "react-icons/cg";
import { MdDomain, MdKeyboardArrowDown, MdLockReset } from "react-icons/md";
import { SiVitest } from "react-icons/si";

export default function MenuButton() {
  const pathname = usePathname();
  const locale = useLocale();
  const { ref, isOpen, toggleOpen } = useOutsideClick();

  return (
    <div className="px-2 relative" ref={ref}>
      <button
        className="flex justify-between items-center bg-[#faf9fa] w-full p-5 text-[#280d5f] text-sm font-semibold rounded-full"
        onClick={toggleOpen}
      >
        SiamOutlet{" "}
        <MdKeyboardArrowDown
          className={`w-7 h-7 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute bg-white left-5 py-3 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.3)] w-60 text-[#280d5f] text-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none" //<-- pointer-events-none ทำให้หลังจากปิด จะไม่สามารถกดปุ่มใน dropdown นี้ได้
        }`}                                                  // หรือป้องกันไม่ให้สามารถกดปุ่มใน dropdown หลังจากปิดได้
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
          <p className="text-sm text-[#7a6eaa] pb-2 px-6">LANGUAGE</p>
          <Link
            href={`${pathname}`}
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
            href={`${pathname}`}
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
            <MdLockReset className="w-7 h-7 text-[#7a6eaa]" />
            <h1 className="text-[#7a6eaa]">Change Password</h1>
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
