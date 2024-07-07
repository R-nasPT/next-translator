"use client";
import { usePathname } from "@/navigation";
import { useState } from "react";

const publicRoutes = ["/"];

const isPublicRoute = (pathname: string) => {
  return publicRoutes.includes(pathname);
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar - แสดงตลอดเวลาบนหน้าจอใหญ่, สไลด์บนหน้าจอเล็ก */}
      <aside
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
        `}
      >
        <header className="p-4 border-b">Tabshier Hub</header>
        <section className="p-4">{/* เนื้อหาของ Sidebar */}</section>
      </aside>

      {/* ส่วนหลักของเนื้อหา */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar สำหรับหน้าจอเล็ก */}
        <nav className="bg-white shadow-sm md:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 focus:outline-none"
          >
            ☰ Menu
          </button>
        </nav>

        {/* เนื้อหาหลัก */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          {children}
        </main>
      </div>

      {/* Overlay สำหรับปิด Sidebar บนหน้าจอเล็ก */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
