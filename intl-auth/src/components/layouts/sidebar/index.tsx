"use client";
import { sidebarMenu } from "@/constants/sidebar";
import { Link, usePathname } from "@/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdMenu } from "react-icons/md";

const publicRoutes = ["/"];

const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname);
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const currentPageTitle = useMemo(() => {
    const currentMenuItem = sidebarMenu.find((item) => item.path === pathname);
    return currentMenuItem ? currentMenuItem.label : "Dashboard";
  }, [pathname]);

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

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
        `}
      >
        <header className="py-4 lg:py-5 px-4 text-[#280d5f] text-lg font-semibold">
          Tabshier Hub
        </header>
        <section>
          <div className="px-2">
            <button className="flex justify-between items-center bg-[#faf9fa] w-full p-5 text-[#280d5f] text-sm font-semibold rounded-full">
              SiamOutlet <MdKeyboardArrowDown className="w-7 h-7" />
            </button>
          </div>
          <ul className="py-2 w-full">
            {sidebarMenu.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.key}
                  href={item.path}
                  className={`py-3 px-5 flex items-center gap-8 text-[#280d5f] cursor-pointer transition-colors duration-300 ${
                    isActive
                      ? "bg-[#7645D914] hover:bg-[#7645d91e]"
                      : "hover:bg-gray-100 "
                  }`}
                >
                  <IconComponent className="w-7 h-7 text-[#783cf1]" />{" "}
                  {item.label}
                </Link>
              );
            })}
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
              <MdMenu className="w-6 h-6 text-[#7645d9]" />
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
