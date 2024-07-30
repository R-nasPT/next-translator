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
  const page = Number(searchParams["page"] ?? "1");
  const per_page = Number(searchParams["per_page"] ?? "10");

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_0_3px_rgba(0,0,0,0.3)] mb-5">
      <section className="flex justify-between items-center gap-5">
        <input
          className="px-5 py-2 rounded-full border border-[#e0e0e0] focus:outline-none bg-[#fafafa] flex-1"
          type="text"
          placeholder="Search"
        />
        <input
          className="hidden lg:block px-5 py-2 rounded-full border border-[#e0e0e0] focus:outline-none bg-[#fafafa] flex-1"
          type="date"
        />
        <h1 className="hidden lg:block">To</h1>
        <input
          className="hidden lg:block px-5 py-2 rounded-full border border-[#e0e0e0] focus:outline-none bg-[#fafafa] flex-1"
          type="date"
        />
        <input
          className="hidden lg:block px-5 py-2 rounded-full border border-[#e0e0e0] focus:outline-none bg-[#fafafa] flex-1"
          type="text"
        />
      </section>

      <section className="hidden lg:flex py-5 gap-3 text-[13px] text-[#280d5f]">
        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          All Status (312)
        </span>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          <div className="p-[6px] bg-[#979797] rounded-full"></div>
          <span>Draft (0)</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          <div className="p-[6px] bg-yellow-400 rounded-full"></div>
          <span>Pending (20)</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          <div className="p-[6px] bg-blue-400 rounded-full"></div>
          <span>Printed (17)</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          <div className="p-[6px] bg-purple-400 rounded-full"></div>
          <span>Picked (35)</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          <div className="p-[6px] bg-pink-400 rounded-full"></div>
          <span>Packed (335)</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          <div className="p-[6px] bg-green-400 rounded-full"></div>
          <span>Dispatched (565)</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300">
          <div className="p-[6px] bg-red-500 rounded-full"></div>
          <span>Cancelled (46)</span>
        </div>
      </section>

      {/* <Suspense fallback={<OrderListSkeleton />}> */}
        <DeliveryOrdersContent page={page} per_page={per_page} />
      {/* </Suspense> */}
    </div>
  );
}
