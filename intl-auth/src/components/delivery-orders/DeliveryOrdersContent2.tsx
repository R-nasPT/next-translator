"use client";

import OrderTable from "./OrderTable";
import Pagination from "../ui/pagination";
import { useDeliveryOrdersDetail } from "@/services/hooks/useDeliveryOrdersQuery";
import { useRouter } from "@/navigation";
import { useState } from "react";

interface DeliveryOrdersContentProps {
  page: number;
  per_page: number;
}
export default function DeliveryOrdersContent({
  page: initialPage,
  per_page: initialPerPage,
}: DeliveryOrdersContentProps) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const { data: orders, isLoading } = useDeliveryOrdersDetail(
    initialPage,
    initialPerPage
  );
  console.log(isLoading);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    router.push(`/delivery-orders?page=${newPage}&per_page=${perPage}`);
  };

  if (isLoading) return <div>Loading...</div>;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const entries = orders?.slice(start, end) || [];
  const totalCount = orders?.length || 0;

  return (
    <>
      <OrderTable orders={entries} />

      <Pagination
        total={totalCount}
        hasNextPage={end < totalCount}
        hasPrevPage={start > 0}
        onPageChange={handlePageChange}
      />
    </>
  );
}
