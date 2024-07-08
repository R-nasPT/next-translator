import { CgShutterstock } from "react-icons/cg";
import { RiDashboardFill } from "react-icons/ri";
import { TbPackageImport, TbTruckDelivery } from "react-icons/tb";

export const sidebarMenu = [
  {
    key: "dashboard",
    icon: RiDashboardFill,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    key: "advices",
    icon: TbPackageImport,
    label: "Advices",
    path: "/advices",
  },
  {
    key: "delivery-orders",
    icon: TbTruckDelivery,
    label: "Delivery Orders",
    path: "/delivery-orders",
  },
  {
    key: "stock",
    icon: CgShutterstock,
    label: "Stock",
    path: "/stock",
  },
];
