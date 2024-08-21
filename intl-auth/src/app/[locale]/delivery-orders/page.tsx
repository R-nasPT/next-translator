// import DeliveryOrdersContent from "@/components/delivery-orders/DeliveryOrdersContent";
import OrderListSkeleton from "@/components/delivery-orders/OrderListSkeleton";
import dynamic from "next/dynamic";
// import { Suspense } from "react";

const DeliveryOrdersContent = dynamic(() => import("@/components/delivery-orders/DeliveryOrdersContent"), {
  loading: () => <OrderListSkeleton />,
});

interface DeliveryOrdersProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DeliveryOrders({
  searchParams,
}: DeliveryOrdersProps) {
  // const page = Number(searchParams["page"] ?? "1");
  // const per_page = Number(searchParams["per_page"] ?? "10");

  const page = Number(searchParams["page"]);
  const per_page = Number(searchParams["per_page"]);
  const status = searchParams["status"] as string | undefined;
  const merchant = searchParams["merchant"] as string | undefined;
  const search = searchParams["search"] as string | undefined;
  const field = searchParams["field"] as string | undefined;

  if (!page || !per_page) {
    redirect("/delivery-orders?page=1&per_page=10");
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_0_3px_rgba(0,0,0,0.3)] mb-5">
      <DeliveryOrderToolbar />

      <DeliveryOrdersContent
        page={page}
        per_page={per_page}
        status={status}
        merchant={merchant}
        search={search}
        field={field}
      />

      {/* <Suspense fallback={<OrderListSkeleton />}> */}
        <DeliveryOrdersContent page={page} per_page={per_page} />
      {/* </Suspense> */}
    </div>
  );
}
