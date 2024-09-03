"use client";
import { CheckboxState, DeliveryOrderListTypes } from "@/types";
import {
  cn,
  exportToExcel,
  formatDateShort,
  formatTimeWithSuffix,
} from "@/utils";
import { usePrefetchOrderId } from "@/services";
import { Checkbox } from "../ui";
import OederListSkeleton from "./OrderListSkeleton";
import StatusBadge from "./StatusBadge";
import OrderMobileSkeleton from "./OrderMobileSkeleton";
import SelectedOrdersSummary from "./SelectedOrdersSummary";
import { useEffect } from "react";
import { useLocale } from "next-intl";

interface OrderTableProps {
  orders: DeliveryOrderListTypes[];
  isLoading: boolean;
  openDrawer: (orderId: string) => void;
  currentStatus: string | undefined;
  openCancel: (orderId: string[]) => void;
  checkboxState: CheckboxState;
}

export default function OrderTable({
  orders,
  isLoading,
  openDrawer,
  currentStatus,
  openCancel,
  checkboxState,
}: OrderTableProps) {
  const locale = useLocale();
  const showCheckboxes = currentStatus !== undefined && currentStatus !== "";
  const {
    handleSelectAll,
    handleSelectItem,
    isAllSelected,
    selectedCount,
    selectedItems,
    selectedIds,
    resetSelection,
  } = checkboxState;

  const prefetchOrderData = usePrefetchOrderId();

  const checkDuplicateRef = (deliveryOrder: DeliveryOrderListTypes, allData: DeliveryOrderListTypes[]) => {
    // ค้นหา reference ที่ซ้ำกัน
    const duplicateRefs = allData.filter(order =>
        order.reference === deliveryOrder.reference &&
        order.accountId === deliveryOrder.accountId &&
        order.id !== deliveryOrder.id &&
        order.status !== 'cancelled'
    );

    // ตรวจสอบว่ามีการซ้ำกันหรือไม่
    return duplicateRefs.length > 0;
}

  const hide = orders.some((order) => {
    const wrongAddress = JSON.parse(order.propertiesJson)?.IFP?.wrongAddress;
    const outOfStock = order.items.some((item) => item.sku.info.onHand < item.amount);
    const hasDuplicate = checkDuplicateRef(order, orders);
  
    return (
      selectedIds.includes(order.id) &&
      (wrongAddress || outOfStock || hasDuplicate)
    );
  });


  const handleExport = async () => {
    const selectedOrders = orders.filter((order) =>
      selectedIds.includes(order.id)
    );

    const columns = [
      { header: "Document Code", key: "documentCode", width: 20 },
      { header: "Reference", key: "reference", width: 30 },
      { header: "Customer Name", key: "customerName", width: 30 },
      { header: "Tracking Code", key: "trackingCode", width: 20 },
      { header: "Courier", key: "courier", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Item Count", key: "itemCount", width: 10 },
      { header: "Note", key: "note", width: 30 },
      { header: "Last Update", key: "lastUpdate", width: 20 },
    ];

    const data = selectedOrders.map((order) => ({
      documentCode: order.code,
      reference: order.reference,
      customerName: order.customerName,
      trackingCode: order.courierTrackingCode,
      courier: order.courier.name,
      status: order.status,
      itemCount: order.itemCount,
      note: order.note,
      lastUpdate: formatDateShort(order.updatedDate, locale),
    }));

    exportToExcel({
      data,
      columns,
      sheetName: "Order",
      filename: "orders.xlsx",
    });
  };

  useEffect(() => {
    resetSelection();
  }, [currentStatus, resetSelection]);

  return (
    <>
      {showCheckboxes && selectedCount > 0 && (
        <SelectedOrdersSummary
          selectedCount={selectedCount}
          selectedIds={selectedIds}
          status={currentStatus}
          openCancel={openCancel}
          handleExport={handleExport}
          hide={hide}
          resetSelection={resetSelection}
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
            orders.map((order) => {
              const wrongAddress = JSON.parse(order.propertiesJson)?.IFP?.wrongAddress;
              const outOfStock = order.items.some(item => item.sku.info.onHand < item.amount)
              const hasDuplicate = checkDuplicateRef(order, orders);

              return (
                <tr
                  key={order.id}
                  className={cn(
                    "border-b border-[#e0e0e0] transition-colors duration-200 cursor-pointer",
                    selectedItems[order.id]
                      ? "bg-[#eee8fa] hover:bg-[#e3d6ff]"
                      : "hover:bg-gray-100",
                    wrongAddress && "bg-green-200 hover:bg-green-300",
                    outOfStock && "bg-red-200 hover:bg-red-300",
                    hasDuplicate && "bg-yellow-100 hover:bg-yellow-200"
                  )}
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
                  <td className="p-4">
                    <p className="font-semibold">{order.courier?.name}</p>
                    <p className="text-[#846eae]">
                      {order.courierTrackingCode}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    {order.cod === 0 ? "-" : order.cod} / {order.printCount}
                    <p>Qty: {order.itemCount}</p>
                  </td>
                  <td className="p-4">
                    <p className="whitespace-nowrap">{formatDateShort(order.updatedDate, locale)}</p>
                    <p>{formatTimeWithSuffix(order.updatedDate, locale)}</p>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* ----- Mobile ----- */}
      <section className="w-full lg:hidden text-sm">
        {isLoading ? (
          <OrderMobileSkeleton />
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`flex gap-3 py-3 border-b border-[#e0e0e0] ${
                selectedItems[order.id] ? "bg-[#eee8fa]" : ""
              }`}
              onMouseEnter={() => prefetchOrderData(order.id)}
              onClick={() => openDrawer(order.id)}
            >
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
              <div className="w-[40%]">
                <span className="text-[#7a6eaa] text-xs">Customer Name</span>
                <p className="text-[#280d5f]  font-semibold !break-words">
                  {order.customerName}
                </p>
                <p className="text-[#7a6eaa]">{order.code}</p>
                <StatusBadge status={order.status} />
              </div>
              <div className="w-[35%]">
                <span className="text-[#7a6eaa] text-xs">Tracking Number</span>
                <p className="text-[#280d5f] font-semibold">
                  {order.courier?.name}
                </p>
                <p className="text-[#7a6eaa]">{order.courierTrackingCode}</p>
              </div>
            </div>
          ))
        )}
      </section>
    </>
  );
}
