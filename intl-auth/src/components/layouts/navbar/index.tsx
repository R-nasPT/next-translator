"use client";

import { MdMenu } from "react-icons/md";

interface NavbarProps {
  isScrolled: boolean;
  onMenuClick: () => void;
}

export default function Navbar({ isScrolled, onMenuClick }: NavbarProps) {
  return (
    <nav
      className={`sticky top-0 pt-10 pb-8 lg:pt-8 lg:pb-6 px-7 flex items-center justify-between rounded-b-lg transition-all duration-200 ${
        isScrolled ? "bg-white shadow-xl" : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-6">
        <button onClick={onMenuClick} className="focus:outline-none lg:hidden">
          <MdMenu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-[#7645d9] lg:text-3xl">
          Dashboard
        </h1>
      </div>
      <button>CREATE +</button>
    </nav>
  );
}
