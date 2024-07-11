"use client";
import { Link, usePathname } from "@/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdMenu } from "react-icons/md";
import MenuButton from "./menu-button";
import { useSidebarMenu } from "@/constants/sidebar";
import Accordion from "@/components/common/accordion";

const publicRoutes = ["/"];

const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname);
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { mainMenu, subMenu } = useSidebarMenu();

  const findMenuLabel = (menus: any) => {
    const menu = menus.find((menu: any) => menu.path === pathname);
    if (menu) return menu.label;

    const subMenu = menus
      .flatMap((menu: any) => menu.sub_menu || [])
      .find((sub: any) => sub.path === pathname);
    return subMenu ? subMenu.label : null;
  };

  const currentPageTitle = useMemo(
    () => findMenuLabel(mainMenu) || findMenuLabel(subMenu) || "Dashboard",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, mainMenu, subMenu]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setIsScrolled(mainContentRef.current.scrollTop > 0);
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  const renderMenuItem = (menu: any, isSubMenu = false) => {
    const IconComponent = menu.icon;
    const isActive = pathname === menu.path;
    const baseClasses = `${isSubMenu ? "py-4 px-10 flex flex-col" : "py-3 px-5 flex items-center gap-8" } text-[#280d5f] cursor-pointer transition-colors duration-300`;
    const activeClasses = isActive ? "bg-[#7645D914] hover:bg-[#7645d91e]" : "hover:bg-gray-100";

    return (
      <Link
        key={menu.key}
        href={menu.path}
        className={`${baseClasses} ${activeClasses}`}
      >
        {!isSubMenu && <IconComponent className="w-7 h-7 text-[#783cf1]" />}
        {menu.label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
        `}
      >
        <header className="py-4 lg:py-7 px-4 text-[#280d5f] text-lg font-semibold">
          Tabshier Hub
        </header>
        <MenuButton />
        <section className="overflow-y-auto max-h-[calc(100vh-100px)] pb-14 hide-scrollbar">
          <ul className="py-2 w-full">
            {mainMenu.map((menu) => renderMenuItem(menu))}
            {subMenu.map((menu) => (
              <Accordion
                key={menu.key}
                className="px-5 py-3 hover:bg-gray-100"
                title={
                  <div className="flex items-center gap-8">
                    <menu.icon className="w-7 h-7 text-[#783cf1]" />{" "}
                    {menu.label}
                  </div>
                }
              >
                {menu.sub_menu.map((sub) => renderMenuItem(sub, true))}
              </Accordion>
            ))}
          </ul>
        </section>
      </aside>

      <div
        ref={mainContentRef}
        className="flex-1 flex flex-col bg-[#fafafa] overflow-y-auto"
      >
        <nav
          className={`sticky top-0 pt-10 pb-8 lg:pt-8 lg:pb-6 px-7 flex items-center justify-between rounded-b-lg transition-all duration-200 ${
            isScrolled ? "bg-white shadow-xl" : "bg-transparent"
          }`}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="focus:outline-none lg:hidden"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-[#7645d9] lg:text-3xl">
              {currentPageTitle}
            </h1>
          </div>
          <button>CREATE +</button>
        </nav>

        <main className="flex-1 px-7">{children}</main>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
