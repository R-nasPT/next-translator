"use client";
import { Link, usePathname } from "@/navigation";
import { useSidebarMenu } from "@/constants";
import MenuButton from "./menu-button";
import Accordion from "@/components/ui/accordion";
import { cn } from "@/utils";
import { IoIosArrowBack } from "@/libs/icons";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { mainMenu, subMenu, dashboardMenu } = useSidebarMenu();

  const renderMenuItem = (menu: any, isSubMenu = false) => {
    const IconComponent = menu.icon;
    const isActive = pathname === menu.path;

    return (
      <Link
        key={menu.key}
        href={menu.path}
        className={cn(
          "text-[#280d5f] cursor-pointer transition-colors duration-300",
          isSubMenu ? "py-4 px-10 flex flex-col" : "py-3 px-5 flex items-center gap-5",
          isActive ? "bg-[#7645D914] hover:bg-[#7645d91e]" : "hover:bg-gray-100"
        )}
      >
        {!isSubMenu && <IconComponent className="w-6 h-6 text-[#783cf1]" />}
        {menu.labelSide}
      </Link>
    );
  };

  return (
    <aside
      className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-72 lg:w-[210px] bg-white shadow-lg transition-transform duration-500 ease-in-out
        `}
    >
      <header
        className="flex items-center gap-5 cursor-pointer py-6 px-5 text-[#280d5f] text-lg font-semibold"
        onClick={onClose}
      >
        <IoIosArrowBack className="w-5 h-5" /> Siam Outlet
      </header>
      <MenuButton />

      <section className="overflow-y-auto max-h-[calc(100vh-100px)] pb-14 text-sm hide-scrollbar lg:show-scrollbar">
        <ul className="w-full">
          <Accordion
            key={dashboardMenu.key}
            className="pl-5 pr-4 lg:pr-2 py-3 hover:bg-gray-100"
            arrow
            title={
              <div className="flex items-center gap-5">
                <dashboardMenu.icon className="w-6 h-6 text-[#783cf1]" />{" "}
                {dashboardMenu.label}
              </div>
            }
          >
            {dashboardMenu.sub_menu.map((sub) => renderMenuItem(sub, true))}
          </Accordion>
          {mainMenu.map((menu) => renderMenuItem(menu))}
          {subMenu.map((menu) => (
            <Accordion
              key={menu.key}
              className="pl-5 pr-4 lg:pr-2 py-3 hover:bg-gray-100"
              arrow
              title={
                <div className="flex items-center gap-5">
                  <menu.icon className="w-6 h-6 text-[#783cf1]" /> {menu.label}
                </div>
              }
            >
              {menu.sub_menu.map((sub) => renderMenuItem(sub, true))}
            </Accordion>
          ))}
        </ul>
      </section>
    </aside>
  );
}
