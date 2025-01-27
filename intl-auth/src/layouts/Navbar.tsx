"use client";

import { useSidebarMenu } from "@/constants";
import { usePathname } from "@/navigation";
import { useCallback, useMemo } from "react";
import NavbarButton from "../button/NavbarButton";

interface NavbarProps {
  isScrolled: boolean;
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const pathname = usePathname();
  const { MAIN_MENU, SUB_MENU, DASHBOARD_MENU } = useSidebarMenu();

  const findMenuLabel = useCallback(
    (menus: any) => {
      const menu = menus.find((menu: any) => menu.path === pathname);
      if (menu) return menu.labelNav;

      const subMenu = menus
        .flatMap((menu: any) => menu.sub_menu || [])
        .find((sub: any) => sub.path === pathname);
      return subMenu ? subMenu.labelNav : null;
    },
    [pathname]
  );

  const currentPageTitle = useMemo(() => {
    if (DASHBOARD_MENU.sub_menu.some((item) => item.path === pathname)) {
      return findMenuLabel(DASHBOARD_MENU.sub_menu) || DASHBOARD_MENU.label;
    }
    return findMenuLabel(MAIN_MENU) || findMenuLabel(SUB_MENU) || "Dashboard";
  }, [findMenuLabel, MAIN_MENU, SUB_MENU, DASHBOARD_MENU, pathname]);

  return (
    <nav
      className={`sticky top-0 pt-10 pb-8 z-40 lg:pt-8 lg:pb-6 px-14 flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-b-lg ${
        isScrolled ? "bg-white shadow-xl" : "bg-transparent"
      }`}
    >
      <h1 className="text-2xl font-bold text-[#7645d9] lg:text-3xl">
        {currentPageTitle}
      </h1>
      <div className="flex items-center gap-3">
        <NavbarButton />
      </div>
    </nav>
  );
}
