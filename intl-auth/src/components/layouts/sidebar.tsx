import { usePathname } from 'next/navigation';

// สมมติว่าเรามีรายการของเส้นทาง public
const publicRoutes = ['/login', '/register', '/about', '/contact'];

function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname);
}

export default function Sidebar() {
  const pathname = usePathname();

  // ถ้าเป็นเส้นทาง public ให้ return null (ไม่แสดง Sidebar)
  if (isPublicRoute(pathname)) {
    return null;
  }

  // ถ้าไม่ใช่เส้นทาง public ให้แสดง Sidebar ตามปกติ
  return (
    <aside>
      <header>Tabshier Hub</header>
      <section>
        {/* เนื้อหาของ Sidebar */}
      </section>
    </aside>
  );
}
