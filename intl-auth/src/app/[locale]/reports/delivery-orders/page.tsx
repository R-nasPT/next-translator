"use client";

import { SearchSelectField } from "@/components/ui";
import { useAccount, useReportOrders } from "@/services";
import { exportToFile, formatDateShort, formatTimeWithSuffix, generateOptions } from "@/utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import OrderReportSkeleton from "@/components/reports/OrderReportSkeleton";
import dynamic from "next/dynamic";

const ClientDateFilter = dynamic(() => import("@/components/common/calendar/DateFilter"), { ssr: false });

export default function DeliveryReport() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [merchant, setMerchant] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState<{
    startDate: string | null;
    endDate: string | null;
    merchant: string | null;
  } | null>(null);
  const day = new Date();

  const t = useTranslations("INDEX");
  const locale = useLocale();

  const { data: account, isLoading } = useAccount();
  const { data: orders, isLoading: isOrderLoading } = useReportOrders(
    filterParams?.startDate,
    filterParams?.endDate,
    filterParams?.merchant
  );

  const accountOptions = async (inputValue: string) => {
    if (!account) return [];
    return await generateOptions(account, inputValue);
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
  };

  const handleMerchantChange = (selectedOption: any) => {
    setMerchant(selectedOption ? selectedOption.value : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterParams({
      startDate: dateRange[0]?.toISOString() || null,
      endDate: dateRange[1]?.toISOString() || null,
      merchant: merchant,
    });
  };

  const onExportToCsv = () => {
    const columns = [
      { header: "Document No.", key: "documentNo", width: 20 },
      { header: "Order No.", key: "orderNo", width: 20 },
      { header: "Customer Name*", key: "customerName", width: 30 },
      { header: "Address*", key: "address", width: 30 },
      { header: "Postal Code*", key: "postalCode", width: 20 },
      { header: "Province*", key: "province", width: 20 },
      { header: "Country*", key: "country", width: 20 },
      { header: "Courier*", key: "courier", width: 20 },
      { header: "COD", key: "cod", width: 15 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Change", key: "change", width: 15 },
      { header: "Internal Code*", key: "internalCode", width: 20 },
      { header: "SKU*", key: "sku", width: 20 },
      { header: "Name", key: "name", width: 30 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Representative Name", key: "representativeName", width: 30 },
      { header: "Customer Name", key: "customerNameAdditional", width: 30 },
      { header: "Note", key: "note", width: 30 },
      { header: "Status", key: "status", width: 20 },
      { header: "Tracking Code", key: "trackingCode", width: 20 },
      { header: "Last Update", key: "lastUpdate", width: 20 },
    ];

    if (!orders) {
      console.error("Orders data is not available.");
      return;
    }

    const data = orders?.flatMap((order) =>
      order.items.map((item) => ({
        documentNo: order.code,
        orderNo: order.reference,
        customerName: order.customerName,
        address: order.deliveryAddress.address,
        postalCode: order.deliveryAddress.postalCode,
        province: order.deliveryAddress.provinceId,
        country: order.deliveryAddress.countryId,
        courier: order.courier.name,
        cod: order.cod,
        phoneNumber: order.customerPhone,
        change: order.change,
        internalCode: item.internalCode,
        sku: item.code,
        name: item.name,
        quantity: item.amount,
        representativeName: order.representativeName,
        customerNameAdditional: order.customerName,
        note: item.note,
        status: order.status,
        trackingCode: order.courierTrackingCode,
        lastUpdate: `${formatDateShort(
          order.updatedDate,
          locale
        )} ${formatTimeWithSuffix(order.updatedDate, locale)}`,
      }))
    );

    exportToFile({
      data,
      columns,
      sheetName: "Order",
      filename: `orders ${formatDateShort(day, locale)}`,
      format: "csv",
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_0_3px_rgba(0,0,0,0.3)] mb-5">
      <form onSubmit={handleSubmit} className="grid gap-3  ">
        <div className="grid lg:flex items-center gap-3">
          {isLoading ? (
            <div className="bg-slate-200 p-5 flex-1 rounded-full animate-pulse"></div>
          ) : (
            <SearchSelectField
              className="flex-1"
              name="merchant"
              placeholder={isLoading ? "Loading..." : t("MERCHANT")}
              loadOptions={accountOptions}
              isLoading={isLoading}
              onChange={handleMerchantChange}
            />
          )}
          <ClientDateFilter
            onDateChange={handleDateChange}
            rounded="2xl"
            startDate={dateRange[0]}
            endDate={dateRange[1]}
          />
        </div>
        <div className="flex gap-2">
          <button
            className={`transition-colors duration-300 px-3 py-2 rounded-full ${
              !dateRange[0] || !dateRange[1]
                ? "bg-[#dedede] text-[#98989a] cursor-not-allowed"
                : "bg-[#1fc7d4] hover:bg-[#2ea5ad] text-white"
            }`}
            type="submit"
            disabled={!dateRange[0] || !dateRange[1]}
            // disabled={!dateRange.every(date => date)}
          >
            Create Preview
          </button>
          {(dateRange[0] || dateRange[1]) && (
            <button
              className="border border-[#1fc7d4] text-[#1fc7d4] hover:bg-[#1fc7d4] hover:text-white transition-colors duration-300 px-3 py-2 rounded-full"
              type="button"
              onClick={onExportToCsv}
            >
              Download CSV
            </button>
          )}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="hidden lg:table w-full text-sm text-[#280d5f] text-left">
          <thead>
            <tr className="border-b border-[#e0e0e0]">
              <th className="font-normal p-4">Document No.</th>
              <th className="font-normal p-4">Order No.</th>
              <th className="font-normal p-4">Customer Name*</th>
              <th className="font-normal p-4">Address*</th>
              <th className="font-normal p-4">Postal Code*</th>
              <th className="font-normal p-4">Province*</th>
              <th className="font-normal p-4">Country*</th>
              <th className="font-normal p-4">Courier*</th>
              <th className="font-normal p-4">COD</th>
              <th className="font-normal p-4">Phone Number</th>
              <th className="font-normal p-4">Change</th>
              <th className="font-normal p-4">Internal Code*</th>
              <th className="font-normal p-4">SKU*</th>
              <th className="font-normal p-4">Name</th>
              <th className="font-normal p-4">Quantity</th>
              <th className="font-normal p-4">Representative Name</th>
              <th className="font-normal p-4">Customer Name</th>
              <th className="font-normal p-4">Note</th>
              <th className="font-normal p-4">Status</th>
              <th className="font-normal p-4">Tracking Code</th>
              <th className="font-normal p-4">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {isOrderLoading ? (
              <OrderReportSkeleton />
            ) : (
              orders?.flatMap((order) =>
                order.items.map((item, index) => (
                  <tr
                    key={`${order.code}-${item.internalCode}-${index}`}
                    className="border-b border-[#e0e0e0] transition-colors duration-200"
                  >
                    <td className="p-4">{order.code}</td>
                    <td className="p-4">{order.reference}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">{order.deliveryAddress.address}</td>
                    <td className="p-4">{order.deliveryAddress.postalCode}</td>
                    <td className="p-4">{order.deliveryAddress.provinceId}</td>
                    <td className="p-4">{order.deliveryAddress.countryId}</td>
                    <td className="p-4">{order.courier.name}</td>
                    <td className="p-4">{order.cod}</td>
                    <td className="p-4">{order.customerPhone}</td>
                    <td className="p-4">{order.change}</td>
                    <td className="p-4">{item.internalCode}</td>
                    <td className="p-4">{item.code}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">{item.amount}</td>
                    <td className="p-4">{order.representativeName}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">{item.note}</td>
                    <td className="p-4">{order.status}</td>
                    <td className="p-4">{order.courierTrackingCode}</td>
                    <td className="p-4">
                      {formatDateShort(order.updatedDate, locale)}{" "}
                      {formatTimeWithSuffix(order.updatedDate, locale)}
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
