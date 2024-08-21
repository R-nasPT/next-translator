"use client";

import OrderTable from "./OrderTable";
import { useRouter } from "@/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDeliveryOrdersList } from "@/services";
import DrawerOrderDetail from "./DrawerOrderDetail";
import OrderStatusFilter from "./OrderStatusFilter";
import CancelDialog from "../common/modal/CancelDialog";
import { Pagination } from "../ui";
import OrderSearch from "./OrderSearch";

interface DeliveryOrdersContentProps {
  page: number;
  per_page: number;
  status?: string;
  merchant?: string;
  search?: string;
  field?: string;
}

export default function DeliveryOrdersContent({
  page: initialPage,
  per_page: initialPerPage,
  status: initialStatus,
  merchant: initialMerchant,
  search: initialSearch,
  field: initialField,
}: DeliveryOrdersContentProps) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    page: initialPage,
    per_page: initialPerPage,
    status: initialStatus,
    merchant: initialMerchant,
    search: initialSearch,
    field: initialField
  });

  const { data: orders, isLoading, isFetching, refetch } = useDeliveryOrdersList( 
    initialPage, initialPerPage, initialStatus, initialMerchant, initialSearch, initialField
  );

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.field) params.append("field", filters.field);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.per_page) params.append("per_page", filters.per_page.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.merchant) params.append("merchant", filters.merchant);
    router.push(`/delivery-orders?${params.toString()}`);
  }, [filters, router]);

  const handleChange = (key: keyof typeof filters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const start = (filters.page - 1) * filters.per_page;
  const end = start + filters.per_page;

  const entries = orders?.data || [];
  const totalCount = orders?.total || 0;

  const handleOpenDrawer = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDrawerOpen(true);
  };

  const handleOpenCancel = (orderId: string | string[]) => {
    if (Array.isArray(orderId)) {
      setCancelOrderId(orderId);
    } else {
      setCancelOrderId([orderId]);
    }
    setOpenCancel(true);
  };

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  return (
    <>
      <OrderSearch
        handleMerchantChange={value => handleChange("merchant", value)}
        handleSearchChange={value => handleChange("search", value)}
        handleFieldChange={value => handleChange("field", value)}
      />

      <OrderStatusFilter
        status={filters.status}
        handleStatusChange={value => handleChange("status", value)}
        statusResponse={orders?.status!}
      />

      <OrderTable
        orders={entries}
        isLoading={isLoading || isFetching}
        openDrawer={handleOpenDrawer}
        currentStatus={filters.status}
        openCancel={handleOpenCancel}
      />

      <Pagination
        total={totalCount}
        hasNextPage={end < totalCount}
        hasPrevPage={start > 0}
        onPerPageChange={value => handleChange("per_page", value)}
      />

      <DrawerOrderDetail
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        orderId={selectedOrderId}
        openCancel={handleOpenCancel}
      />

      <CancelDialog
        refetch={refetch}
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        orderId={cancelOrderId}
      />
    </>
  );
}
