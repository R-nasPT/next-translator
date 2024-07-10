import { useTranslations } from "next-intl";
import { AiOutlineProduct } from "react-icons/ai";
import { BiSolidReport } from "react-icons/bi";
import {
  MdOutlineInventory2,
  MdOutlineSettings,
  MdSupportAgent,
} from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { TbPackageImport, TbTruckDelivery } from "react-icons/tb";

export const useSidebarMenu = () => {
  const t = useTranslations("MENU");

  const mainMenu = [
    {
      key: "dashboard",
      icon: RiDashboardFill,
      label: t("DASHBOARD"),
      path: "/dashboard",
    },
    {
      key: "advices",
      icon: TbPackageImport,
      label: t("ADVICES"),
      path: "/advices",
    },
    {
      key: "delivery-orders",
      icon: TbTruckDelivery,
      label: t("DELIVERY_ORDERS"),
      path: "/delivery-orders",
    },
    {
      key: "stock",
      icon: MdOutlineInventory2,
      label: t("STOCK"),
      path: "/stock",
    },
  ];

  const subMenu = [
    {
      key: "product",
      icon: AiOutlineProduct,
      label: t("PRODUCT"),
      sub_menu: [
        {
          key: "products",
          label: "PRODUCTS",
          path: "/products",
        },
        {
          key: "bundles",
          label: "BUNDLES",
          path: "/products/bundles",
        },
        {
          key: "assembled",
          label: "ASSEMBLED",
          path: "/products/assembled-skus",
        },
        {
          key: "unit-conversion",
          label: "UNIT_CONVERSION",
          path: "/products/unit-conversion",
        },
      ],
    },
    {
      key: "reports",
      icon: BiSolidReport,
      label: t("REPORTS"),
      sub_menu: [
        {
          key: "delivery",
          label: "Delivery Orders",
          path: "/reports/delivery-orders",
        },
        {
          key: "items",
          label: "ITEMS",
          path: "/reports/items",
        },
        {
          key: "deliveries",
          label: "DELIVERIES",
          path: "/reports/deliveries",
        },
        {
          key: "advices",
          label: t("ADVICES"),
          path: "/reports/advices",
        },
      ],
    },
    {
      key: "settings",
      icon: MdOutlineSettings,
      label: t("SETTINGS"),
      sub_menu: [
        {
          key: "my-account",
          label: "MY_ACOUNT",
          path: "/settings/my-account",
        },
        {
          key: "user-management",
          label: "USER_MANAGEMENT",
          path: "/settings/user-management",
        },
        {
          key: "application",
          label: "APPLICATION",
          path: "/settings/application",
        },
        {
          key: "webhooks",
          label: "WEBHOOKS",
          path: "/settings/webhooks",
        },
      ],
    },
    {
      key: "support",
      icon: MdSupportAgent,
      label: t("SUPPORT"),
      sub_menu: [
        {
          key: "knowledge-center",
          label: "KNOWLEDGE_CENTER",
          path: "/support/knowledge-center",
        },
        {
          key: "contact-us",
          label: "CONTACT_US",
          path: "/support/contact-us",
        },
      ],
    },
  ];

  return { mainMenu, subMenu };
};
