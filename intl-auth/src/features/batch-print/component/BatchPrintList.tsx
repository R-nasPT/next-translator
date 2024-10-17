"use client";

import { Checkbox, Modal } from "@/components/ui";
import { useSearchParams } from "next/navigation";
import { useDeliveryorderIds } from "../services/orderIds";
import { StatusBadge } from "@/components/common";
import { BatchPrintLabel } from "@/documents/print";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Link } from "@/navigation";
import { useCheckbox } from "@/hooks";
import { useUpdateBatchOrderNumber } from "../services/updateBatchOrderNumber";

export default function BatchPrintList() {
  const searchParams = useSearchParams();
  const bathPrintRef = useRef<HTMLDivElement>(null);
  const currentTimeInMillis = Date.now();

  const orderIds = searchParams.get("ids")?.split(",") || [];
  const orderQueries = useDeliveryorderIds(orderIds);
  const { mutateAsync } = useUpdateBatchOrderNumber();

  const items = orderQueries.map((query, index) => ({ id: orderIds[index] }));
  const { handleSelectAll, handleSelectItem, isAllSelected, selectedItems } =
    useCheckbox(items);

  const selectedOrders = orderQueries
    .filter((query, index) => selectedItems[orderIds[index]] && query.data)
    .map((query) => query.data!);
  console.log(selectedOrders);
  const handlePrint = useReactToPrint({
    contentRef: bathPrintRef,
  });

  const onSubmit = async () => {
    try {
      const ordersToUpdate = selectedOrders.map((order) => ({
        ...order,
        properties: {
          ...order.properties,
          launchpadBatchNumber: currentTimeInMillis,
        },
      }));
  
      await mutateAsync(ordersToUpdate);

      console.log("All selected orders updated successfully");
    } catch (error) {
      console.error("Error updating orders:", error);
    }
  };

  return (
    <Modal>
      <div
        className={`relative bg-white px-5 pb-5 py-3 lg:h-[60vh] w-[90vw] lg:w-[55vw] rounded-3xl ${
          orderQueries.length > 3 ? "h-[100vh]" : "h-[50vh]"
        }`}
      >
        <h1 className="pb-5 md:pb-0">Batch Print List</h1>
        {/* --- Desktop --- */}
        <div className="overflow-auto h-[83%] hidden md:block">
          <table className="w-full text-xs text-[#280d5f] text-left">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="border-b border-[#eaeaea]">
                <th className="p-1">
                  <Checkbox
                    id="selectAll"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="font-normal p-4">Code</th>
                <th className="font-normal p-4">Reference</th>
                <th className="font-normal p-4">Courier</th>
                <th className="font-normal p-4">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {orderQueries.map((query, index) => (
                <tr key={orderIds[index]} className="border-b border-[#eaeaea]">
                  {query.isLoading ? (
                    <td colSpan={5} className="p-2 text-center">
                      Loading...
                    </td>
                  ) : (
                    <>
                      <td className="p-1">
                        <Checkbox
                          id={`row-${query.data?.id}`}
                          checked={selectedItems[query.data?.id!] || false}
                          onChange={handleSelectItem(query.data?.id!)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-center">
                          <StatusBadge status={query.data?.status!} />
                          <p className="text-[13px] text-[#7c70ab] whitespace-nowrap">
                            {query.data?.code}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">{query.data?.reference}</p>
                        <p className="text-[#846eae]">
                          {query.data?.customerName}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold w-[150px]">
                          {query.data?.courier.name}
                        </p>
                        <p className="text-[#846eae]">
                          {query.data?.courierTrackingCode}
                        </p>
                      </td>
                      <td className="p-4">
                        {query.data?.attachments?.map((attachment) => (
                          <div key={attachment.attachmentId} className="mb-2">
                            <Link
                              href={attachment.link}
                              target="_blank"
                              className="text-blue-500 underline"
                            >
                              {attachment.filename}
                            </Link>
                          </div>
                        ))}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ----- Mobile ----- */}
        <section
          className={`w-full md:hidden text-sm overflow-auto ${
            orderQueries.length > 3 ? "h-[90%]" : "h-[80%]"
          }`}
        >
          {orderQueries.map((query, index) => (
            <div
              key={orderIds[index]}
              className="flex gap-3 py-3 border-b border-[#e0e0e0]"
            >
              {query.isLoading ? (
                <p>Loading order {orderIds[index]}...</p>
              ) : (
                <>
                  <div className={"w-1/2 px-3"}>
                    <span className="text-[#7a6eaa] text-xs">
                      Customer Name
                    </span>
                    <p className="text-[#280d5f]  font-semibold !break-words">
                      {query.data?.customerName}
                    </p>
                    <p className="text-[#7a6eaa]">{query.data?.code}</p>
                    <StatusBadge status={query.data?.status!} />
                  </div>
                  <div className={"w-1/2"}>
                    <span className="text-[#7a6eaa] text-xs">
                      Tracking Number
                    </span>
                    <p className="text-[#280d5f] font-semibold">
                      {query.data?.courier?.name}
                    </p>
                    <p className="text-[#7a6eaa]">
                      {query.data?.courierTrackingCode}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </section>

        <div className="hidden">
          <BatchPrintLabel ref={bathPrintRef} printedData={selectedOrders} />
        </div>

        <div className="w-full px-5 absolute bottom-2 left-0">
          <button
            className="w-full py-1 bg-green-500 hover:bg-green-600 text-white rounded-md transition-smooth"
            onClick={onSubmit}
            disabled={selectedOrders.length === 0}
          >
            พิมพ์
          </button>
        </div>
      </div>
    </Modal>
  );
}
