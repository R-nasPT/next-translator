import { useCurrentDateTime } from "@/hooks";
import { OrderIdTypes } from "@/types";
import { calculateSum } from "@/utils";
import { UseQueryResult } from "@tanstack/react-query";
import { forwardRef } from "react";
import Barcode from "react-barcode";

interface ThaiPostDispatchLabelProps {
  order?: UseQueryResult<OrderIdTypes, Error>[];
  dispatchBatchNumber: string;
}

// ---------- จำลอง order จำนวน 35 แถว ------------
const generateSampleOrders = (): UseQueryResult<OrderIdTypes, Error>[] => {
  return Array.from({ length: 35 }, (_, index) => ({
    data: {
      courierId: `COURIER-${index + 1}`,
      customerName: `ลูกค้า ${index + 1}`,
      deliveryAddress: {
        postalCode: `${10000 + index}`,
      },
      courierTrackingCode: `TRACK-${index + 1}`,
      deliveryFee: Math.floor(Math.random() * 100) + 50, // Random fee between 50-150
      note: index % 5 === 0 ? `หมายเหตุพิเศษ` : "",
    },
    isLoading: false,
    isError: false,
    error: null,
  })) as UseQueryResult<OrderIdTypes, Error>[];
};

const ThaiPostDispatchLabel = forwardRef<
  HTMLDivElement,
  ThaiPostDispatchLabelProps
>(({ order, dispatchBatchNumber }, ref) => {
  const { currentDate } = useCurrentDateTime();
  // const order = generateSampleOrders() //<--- จำลอง order

  const generateRowData = (startIndex: number) => {
    const maxRows = 20;
    const pageOrders = order?.slice(startIndex, startIndex + maxRows) || [];
    const emptyRowCount = maxRows - pageOrders.length;

    return {
      filledRows: pageOrders.map((query, idx) => ({
        index: startIndex + idx + 1,
        ...query.data,
      })),
      emptyRows: Array(emptyRowCount).fill(null),
      startIndex
    };
  };

  const totalPages = Math.ceil((order?.length || 0) / 20);

  return (
    <div ref={ref}>
      {[...Array(totalPages)].map((_, pageIndex) => {
        const { filledRows, emptyRows, startIndex } = generateRowData(pageIndex * 20);
        const totalDeliveryFee = calculateSum(
          filledRows.map((row) => row.deliveryFee) ?? []
        );

        return (
          <div key={pageIndex} className="py-7 px-12 text-sm break-after-page">
            <div className="px-3">
              <div className="flex justify-between">
                <div>
                  <p>บริษัท สยาม เอาท์เลต จำกัด</p>
                  <p className="text-xs">11 ถนนราษฏบูรณะ</p>
                  <p className="text-xs">
                    แขวงราษฏบูรณะ เขตราษฏบูรณะ กรุงเทพมหานคร 10140
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-5">
                  <p>วันที่</p>
                  <p>{currentDate}</p>
                  <p>ใบอณุญาติที่พิเศษ</p>
                  <p>192/2558</p>
                  <p>ศฝ./ปณ.</p>
                  <p>ยานาวา</p>
                  <p className="col-span-2">
                    ฝากส่งครั้งที่_________________________
                  </p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-semibold">
                  ใบนำส่งสิ่งของทางไปรษณีย์โดยชำระค่าบริการเป็นเงินเชื่อ
                </p>
                <p>{order?.[0]?.data?.courierId}</p>
                <p className="text-xs">
                  ได้ฝากส่งสิ่งของไปรษณีย์ ดังรายการต่อไปนี้
                </p>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {[
                    "ลำดับ",
                    "ชื่อผู้รับ",
                    "รหัสไปรษณย์",
                    "เลขที่พัสดุ",
                    "ค่าบริการ",
                    "หมายเหตุ",
                  ].map((head) => (
                    <th
                      key={head}
                      className="p-1 border border-gray-300 text-left whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Filled Rows */}
                {filledRows?.map((row) => (
                  <tr key={row.index}>
                    <td className="px-1 border border-gray-300 text-center">
                      {row.index}
                    </td>
                    <td className="px-1 border border-gray-300">
                      {row.customerName}
                    </td>
                    <td className="px-1 border border-gray-300">
                      {row.deliveryAddress?.postalCode}
                    </td>
                    <td className="px-1 border border-gray-300">
                      {row.courierTrackingCode}
                    </td>
                    <td className="px-1 border border-gray-300">
                      {row.deliveryFee}
                    </td>
                    <td className="px-1 border border-gray-300">{row.note}</td>
                  </tr>
                ))}

                {/* Empty Rows */}
                {emptyRows.map((_, idx) => (
                  <tr key={`empty-${idx}`}>
                    <td className="px-1 border border-gray-300 text-center">
                      {startIndex + filledRows.length + idx + 1}
                    </td>
                    <td className="px-1 border border-gray-300"></td>
                    <td className="px-1 border border-gray-300"></td>
                    <td className="px-1 border border-gray-300"></td>
                    <td className="px-1 border border-gray-300"></td>
                    <td className="px-1 border border-gray-300"></td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr>
                  <td className="p-0.5" colSpan={4}>
                    ตัวอักษร__________________________________รวมทั้งสิ้น
                  </td>
                  <td className="p-0.5 border border-gray-300">
                    {totalDeliveryFee}
                  </td>
                  <td className="p-0.5">บาท</td>
                </tr>
              </tbody>
            </table>

            <section className="flex py-3">
              <article className="text-xs space-y-5 w-1/2">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-0.5 border border-gray-300 text-left">
                        จำนวน
                      </th>
                      <th className="p-0.5 border border-gray-300 text-left">
                        บาท
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "ยอดยกมา",
                      "ฝากส่งครั้งที่____________",
                      "รวม/ยอดยกไป",
                    ].map((row) => (
                      <tr key={row}>
                        <td className="p-0.5 border border-gray-300">{row}</td>
                        <td className="p-0.5 border border-gray-300"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-0.5 border border-gray-300 text-left">
                        ประเภทบริการ
                      </th>
                      <th
                        className="p-0.5 border border-gray-300 text-left"
                        colSpan={2}
                      >
                        ในประเทศ
                      </th>
                      <th
                        className="p-0.5 border border-gray-300 text-left"
                        colSpan={2}
                      >
                        ต่างประเทศ
                      </th>
                      <th className="p-0.5 border border-gray-300 text-left">
                        รวมเป็นเงิน
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-0.5 border border-gray-300">บริการ</td>
                      <td className="p-0.5 border border-gray-300">ชิ้น</td>
                      <td className="p-0.5 border border-gray-300">เงิน(1)</td>
                      <td className="p-0.5 border border-gray-300">ชิ้น</td>
                      <td className="p-0.5 border border-gray-300">เงิน(2)</td>
                      <td className="p-0.5 border border-gray-300">(1+2)</td>
                    </tr>
                    {[
                      "ลงทะเบียน",
                      "รับรอง",
                      "EMS",
                      "พัสดุ",
                      "สิ่งตีพิมพ์",
                      "จม.ธรรมดา",
                      "ยอดรวม",
                    ].map((row) => (
                      <tr key={row}>
                        <td className="p-0.5 border border-gray-300">{row}</td>
                        <td className="p-0.5 border border-gray-300"></td>
                        <td className="p-0.5 border border-gray-300"></td>
                        <td className="p-0.5 border border-gray-300"></td>
                        <td className="p-0.5 border border-gray-300"></td>
                        <td className="p-0.5 border border-gray-300"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>

              <article className="w-1/2 space-y-5 text-center text-xs pt-5">
                <div className="h-[25%] flex flex-col justify-between">
                  <p>ได้ตรวจสอบความถูกต้องแล้ว</p>
                  <div>
                    <p>ลงชื่อ___________________</p>
                    <p>ผู้รับผิดชอบในการฝากส่ง</p>
                  </div>
                </div>
                <div className="h-[25%] flex flex-col justify-between">
                  <p>ได้ตรวจสอบและรับฝากไว้ถูกต้องแล้ว</p>
                  <div>
                    <p>ลงชื่อ___________________</p>
                    <p>เจ้าหน้าที่รับฝาก</p>
                  </div>
                </div>
                <div className="h-[25%] flex flex-col justify-end">
                  <p>_____________________</p>
                  <p>ตราประจำวัน</p>
                </div>
              </article>
            </section>
            {dispatchBatchNumber && (
              <Barcode value={dispatchBatchNumber} height={35} width={1.5} />
            )}
          </div>
        );
      })}
    </div>
  );
});

ThaiPostDispatchLabel.displayName = "ThaiPostDispatchLabel";

export default ThaiPostDispatchLabel;
