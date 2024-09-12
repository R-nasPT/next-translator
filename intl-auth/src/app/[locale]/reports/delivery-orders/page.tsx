"use client";

import { useReportOrders } from "@/services";
import { exportToFile, formatDateShort, formatTimeWithSuffix } from "@/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FilterCondition, FullStatusTypes } from "@/types";
import OrderReportSkeleton from "@/components/reports/OrderReportSkeleton";
import OrderFilterReport from "@/components/reports/OrderFilterReport";

interface OrderRowData {
  documentNo: string;
  orderNo: string;
  customerName: string;
  address: string;
  postalCode: string;
  province: string;
  country: string;
  courier: string;
  cod: number;
  phoneNumber: string;
  change: number;
  internalCode: string;
  sku: string | null;
  name: string;
  quantity: number;
  representativeName: string | null;
  customerNameAdditional: string | null;
  note: string | null;
  status: FullStatusTypes;
  trackingCode: string | null;
  lastUpdate: string;
}

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

export default function DeliveryReport() {
  const [previewData, setPreviewData] = useState<OrderRowData[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [filterParams, setFilterParams] = useState<{
    startDate: string | null;
    endDate: string | null;
    merchant: string | null;
    filters: FilterCondition[];
  } | null>(null);

  const day = new Date();
  const locale = useLocale();
  const t = useTranslations("INDEX");

  const { data: orders, isLoading: isOrderLoading } = useReportOrders(
    filterParams?.startDate,
    filterParams?.endDate,
    filterParams?.merchant,
    filterParams?.filters
  );

  const handleFormSubmit = (formData: {
    dateRange: [Date | null, Date | null];
    merchant: string | null;
    filterConditions: FilterCondition[];
  }) => {
    setFilterParams({
      startDate: formData.dateRange[0]?.toISOString() || null,
      endDate: formData.dateRange[1]?.toISOString() || null,
      merchant: formData.merchant,
      filters: formData.filterConditions,
    });
  };

  const onExportToCsv = () => {
    exportToFile({
      data: previewData,
      columns,
      sheetName: "Order",
      filename: `orders ${formatDateShort(day, locale)}`,
      format: "csv",
    });
  };

  useEffect(() => {
    if (orders) {
      const flattenedData: OrderRowData[] = orders.flatMap((order) =>
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
          lastUpdate: `${formatDateShort(order.updatedDate, locale
          )} ${formatTimeWithSuffix(order.updatedDate, locale)}`,
        }))
      );
      setPreviewData(flattenedData);
      setTotalRows(flattenedData.length);
    }
  }, [locale, orders]);

  return (
    <>
      <OrderFilterReport onSubmit={handleFormSubmit} />
      {totalRows > 0 &&
        (isOrderLoading ? (
          <OrderReportSkeleton />
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-[0_0_3px_rgba(0,0,0,0.3)] mb-5">
            <section className="flex justify-between items-start lg:items-center">
              <div>
                <p className="text-[#280d5f]">{t("EXPORT_DATA_PREVIEW")}</p>
                <p className="text-[#7a6eaa] text-sm">{t("PREVIEW_ONLY")}</p>
                <p className="text-[#1fc7dc]">
                  {t("ROWS_AND_FIELDS", { totalRows, fields: columns.length })}
                </p>
              </div>
              <button
                className="border border-[#1fc7d4] text-[#1fc7d4] hover:bg-[#1fc7d4] hover:text-white transition-colors duration-300 px-3 py-2 rounded-full whitespace-nowrap"
                type="button"
                onClick={onExportToCsv}
              >
                Download CSV
              </button>
            </section>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-[#280d5f] text-left">
                <thead>
                  <tr className="border-b border-[#e0e0e0]">
                    {columns.map((col) => (
                      <th key={col.key} className="font-normal p-4">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#e0e0e0] transition-colors duration-200"
                    >
                      {Object.keys(row).map((key) => (
                        <td className="p-4" key={key}>
                          {row[key as keyof OrderRowData]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </>
  );
}
