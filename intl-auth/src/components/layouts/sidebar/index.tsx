"use client";
import { Link, usePathname } from "@/navigation";
import MenuButton from "./menu-button";
import { useSidebarMenu } from "@/constants/sidebar";
import Accordion from "@/components/common/accordion";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { mainMenu, subMenu } = useSidebarMenu();

  const renderMenuItem = (menu: any, isSubMenu = false) => {
    const IconComponent = menu.icon;
    const isActive = pathname === menu.path;
    const baseClasses = `${isSubMenu ? "py-4 px-10 flex flex-col" : "py-3 px-5 flex items-center gap-5"} text-[#280d5f] cursor-pointer transition-colors duration-300`;
    const activeClasses = isActive ? "bg-[#7645D914] hover:bg-[#7645d91e]" : "hover:bg-gray-100";

    return (
      <Link
        key={menu.key}
        href={menu.path}
        className={`${baseClasses} ${activeClasses}`}
      >
        {!isSubMenu && <IconComponent className="w-6 h-6 text-[#783cf1]" />}
        {menu.label}
      </Link>
    );
  };

  return (
    <aside
      className={`
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-72 lg:w-[210px] bg-white shadow-lg transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
        `}
    >
      <header className="py-4 lg:py-6 px-4 text-[#280d5f] text-lg font-semibold">
        Tabshier Hub
      </header>
      <MenuButton />

      <section className="overflow-y-auto max-h-[calc(100vh-100px)] pb-14 hide-scrollbar text-sm">
        <ul className="w-full">
          {mainMenu.map((menu) => renderMenuItem(menu))}
          {subMenu.map((menu) => (
            <Accordion
              key={menu.key}
              className="pl-5 pr-2 py-3 hover:bg-gray-100"
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
