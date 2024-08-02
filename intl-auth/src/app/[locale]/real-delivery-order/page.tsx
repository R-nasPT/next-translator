import DeliveryOrdersContent from "@/components/delivery-orders/DeliveryOrdersContent";
import { redirect } from "@/navigation";

interface DeliveryOrdersProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DeliveryOrders({
  searchParams,
}: DeliveryOrdersProps) {
  const page = Number(searchParams["page"]);
  const per_page = Number(searchParams["per_page"]);
  const status = searchParams["status"] as string | undefined;

  if (!page || !per_page) {
    redirect('/delivery-orders?page=1&per_page=10');
  }

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

        <DeliveryOrdersContent page={page} per_page={per_page} status={status}/>
    </div>
  );
}
