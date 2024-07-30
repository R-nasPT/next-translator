import { getDetailedDeliveryOrders } from "@/services";
import OrderTable from "./OrderTable";
import Pagination from "../ui/pagination";

interface DeliveryOrdersContentProps {
  page: number;
  per_page: number;
}
export default async function DeliveryOrdersContent({
  page,
  per_page,
}: DeliveryOrdersContentProps) {
  const orders = await getDetailedDeliveryOrders();

  const start = (page - 1) * per_page;
  const end = start + per_page;

  const entries = orders.slice(start, end);

  return (
    <>
      <OrderTable orders={entries} />

      <Pagination
        total={orders.length}
        hasNextPage={end < orders.length}
        hasPrevPage={start > 0}
      />
    </>
  );
}
