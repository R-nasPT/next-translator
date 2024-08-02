"use client";

import OrderTable from "./OrderTable";
import Pagination from "../ui/pagination";
import { useRouter } from "@/navigation";
import { useEffect, useState } from "react";
import { useDeliveryOrdersList } from "@/services";
import DrawerOrderDetail from "./DrawerOrderDetail";
import OrderStatusFilter from "./OrderStatusFilter";

interface DeliveryOrdersContentProps {
  page: number;
  per_page: number;
  status?: string;
}
export default function DeliveryOrdersContent({
  page: initialPage,
  per_page: initialPerPage,
  status: initialStatus,
}: DeliveryOrdersContentProps) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [status, setStatus] = useState(initialStatus);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const {
    data: orders,
    isLoading,
    isFetching,
  } = useDeliveryOrdersList(initialPage, initialPerPage, initialStatus);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    router.push(
      `/delivery-orders?page=1&per_page=${perPage}${
        newStatus !== "" ? `&status=${newStatus}` : ""
      }`
    );
  };

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const entries = orders?.data || [];
  const totalCount = orders?.total || 0;

  useEffect(() => {
    if (initialPage !== page) setPage(initialPage);
    if (initialPerPage !== perPage) setPerPage(initialPerPage);
    if (initialStatus !== status) setStatus(initialStatus);
  }, [initialPage, initialPerPage, initialStatus, page, perPage, status]);

  return (
    <>
      <OrderStatusFilter
        status={status}
        handleStatusChange={handleStatusChange}
      />

      <OrderTable
        orders={entries}
        isLoading={isLoading}
        isFetching={isFetching}
        openDrawer={() => setIsDrawerOpen(true)}
      />

      <Pagination
        total={totalCount}
        hasNextPage={end < totalCount}
        hasPrevPage={start > 0}
      />

      <DrawerOrderDetail
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
