"use client";
import { useCheckbox } from "@/hooks";
import Checkbox from "../ui/checkbox";
import { DeliveryOrderListTypes } from "@/types";
import { formatDateLong, formatTime } from "@/utils";
import OederListSkeleton from "./OrderListSkeleton";
import StatusBadge from "./StatusBadge";
import OrderMobileSkeleton from "./OrderMobileSkeleton";
import { usePrefetchOrderId } from "@/services";
import SelectedOrdersSummary from "./SelectedOrdersSummary";

interface OrderTableProps {
  orders: DeliveryOrderListTypes[];
  isLoading: boolean;
  openDrawer: (orderId: string) => void;
  currentStatus: string | undefined;
}

export default function OrderTable({ orders, isLoading, openDrawer, currentStatus }: OrderTableProps) {
  const showCheckboxes = currentStatus !== undefined && currentStatus !== "";
  const { handleSelectAll, handleSelectItem, isAllSelected, selectedCount, selectedItems, selectedIds } = useCheckbox(orders);

  const prefetchOrderData = usePrefetchOrderId();

  return (
    <>
      {showCheckboxes && selectedCount > 0 && (
        <SelectedOrdersSummary
        selectedCount={selectedCount}
        selectedIds={selectedIds}
      />
      )}

      {/* ----- Desktop ----- */}
      <table className="hidden lg:table w-full text-sm text-[#280d5f] text-left">
        <thead>
          <tr className="border-b border-[#e0e0e0]">
            {showCheckboxes && (
              <th className="p-1">
                <Checkbox
                  id="selectAll"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            <th className="font-normal p-4">Code</th>
            <th className="font-normal p-4">Reference</th>
            <th className="font-normal p-4">Courier</th>
            <th className="font-normal p-4">COD / Count</th>
            <th className="font-normal p-4">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <OederListSkeleton />
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className={`border-b border-[#e0e0e0] transition-colors duration-200 cursor-pointer ${
                  selectedItems[order.id]
                    ? "bg-[#eee8fa] hover:bg-[#e3d6ff]"
                    : "hover:bg-gray-100"
                }`}
                onMouseEnter={() => prefetchOrderData(order.id)}
                onClick={() => openDrawer(order.id)}
              >
                {showCheckboxes && (
                  <td className="p-1" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id={`row-${order.id}`}
                      checked={selectedItems[order.id] || false}
                      onChange={handleSelectItem(order.id)}
                    />
                  </td>
                )}
                <td className="p-4 flex flex-col gap-1 items-center">
                  <StatusBadge status={order.status} />
                  <p className="text-[13px] text-[#7c70ab] whitespace-nowrap">
                    {order.code}
                  </p>
                </td>
                <td className="p-4">
                  <p className="font-semibold">{order.reference}</p>
                  <p className="text-[#846eae]">{order.customerName}</p>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <p className="font-semibold">{order.courier?.name}</p>
                  <p className="text-[#846eae]">{order.courierTrackingCode}</p>
                </td>
                <td className="p-4 text-center">
                  {order.cod === 0 ? "-" : order.cod} / {order.printCount}
                  <p>Qty: {order.itemCount}</p>
                </td>
                <td className="p-4">
                  <p>{formatDateLong(order.updatedDate)}</p>
                  <p>เวลา {formatTime(order.updatedDate)}</p>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ----- Mobile ----- */}
      <table className="w-full lg:hidden text-sm">
        <tbody>
          {isLoading ? (
            <OrderMobileSkeleton />
          ) : (
            orders.map((order) => (
              <tr
                key={order.id}
                className={`border-b border-[#e0e0e0] ${
                  selectedItems[order.id] ? "bg-[#eee8fa]" : ""
                }`}
                onMouseEnter={() => prefetchOrderData(order.id)}
                onClick={() => openDrawer(order.id)}
              >
                <td className="py-4 flex gap-1 md:gap-4">
                  {showCheckboxes && (
                    <div
                      className="flex justify-center items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        id={`row-${order.id}`}
                        checked={selectedItems[order.id] || false}
                        onChange={handleSelectItem(order.id)}
                        size="lg"
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-[#7a6eaa] text-xs">
                      Customer Name
                    </span>
                    <p className="text-[#280d5f]  font-semibold">
                      {order.customerName}
                    </p>
                    <p className="text-[#7a6eaa]">{order.code}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </td>
                <td className="py-4 pl-4">
                  <span className="text-[#7a6eaa] text-xs">
                    Tracking Number
                  </span>
                  <p className="text-[#280d5f] font-semibold">
                    {order.courier?.name}
                  </p>
                  <p className="text-[#7a6eaa]">{order.courierTrackingCode}</p>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
