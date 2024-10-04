import { usePathname } from "@/navigation";

const NON_UPDATE_PAGES = ['/batch-print'];

export default function useIsUpdateAllowedPage() {
  const pathname = usePathname();
  return !NON_UPDATE_PAGES.some((page) => pathname.includes(page));
}

//ใช้ใน DeliveryOrderContent
