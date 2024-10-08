import { useCurrentDateTime } from "@/hooks";
import { useAccountId, useSkuId } from "@/services";
import { DeliveryOrderPrint } from "@/types";
import { ForwardedRef, forwardRef } from "react";
import Barcode from "react-barcode";

interface OrderPrintProps {
  printedData: DeliveryOrderPrint[];
}

const OrderPrint = forwardRef<HTMLDivElement, OrderPrintProps>(
  ({ printedData }, ref: ForwardedRef<HTMLDivElement>) => {
    const { currentDate, currentTime, seconds } = useCurrentDateTime();

    const accountQueries = useAccountId(printedData.map((data) => data.accountId));

     // const accountQueries: UseQueryResult<AccountResponse, Error>[] = useQueries({
    //   queries: printedData.map((data) => ({
    //     queryKey: ["accountId", data.accountId],
    //     queryFn: () => fetchAccountId(data.accountId),
    //     retry: 1,
    //     onError: (error: any) => {
    //       console.error(`Error fetching account ${data.accountId}:`, error);
    //     },
    //   })),
    // });

        // รวบรวม skuIds ทั้งหมด
    const allSkuIds = printedData.flatMap((data) =>
      data.items.map((item) => item.skuId)
    );

    // ใช้ Hook เพื่อดึงข้อมูล SKU ทั้งหมด
    const skuQueries = useSkuId(allSkuIds);

    return (
      <div ref={ref}>
        {printedData.map((data, index) => {
          const accountQuery = accountQueries[index];
          const accountData = accountQuery.data?.data;

          return (
            <div
              key={data.id}
              className="px-8 py-[19px] print:break-after-page"
            >
              <div className="text-[10px] grid grid-cols-2 print:fixed print:top-0 print:left-0 print:right-0 print:bg-white print:z-10 print:pt-[19px] print:px-8">
                <p>
                  {currentDate}, {currentTime}
                </p>
                <p>Siam Outlet</p>
              </div>
              <header className="flex justify-between print:mt-4">
                <div className="pl-4 mt-[3px] flex gap-2">
                  <Barcode
                    value={data.code}
                    width={1.15}
                    height={43}
                    margin={0}
                    textMargin={0}
                    fontSize={16}
                  />
                  <p>{accountData?.name}</p>
                </div>
                <div>
                  <p>0/</p>
                  <p>{data.courierId}</p>
                  <p>
                    Print: 2 on {currentDate} {currentTime}:{seconds}
                  </p>
                </div>
              </header>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left border border-[#e8e8e8] p-2">
                      {data.accountId}
                    </th>
                    <th className="text-left border border-[#e8e8e8] p-2">
                      Qty
                    </th>
                    <th className="text-left border border-[#e8e8e8] border-r-0 p-2">
                      Name (order ref : {data.reference})
                    </th>
                    <th className="text-left border border-[#e8e8e8] border-r-0 p-2">
                      Barcode
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index: number) => {
                    const skuQuery = skuQueries.find((q) => q.data && q.data.data?.id === item.skuId);
                    const bubble = skuQuery?.data.data.properties.IFP?.debitNote?.bubbleA41?.status;

                    return (
                      <tr key={index}>
                        <td className="text-left border border-[#e8e8e8] p-2">
                          {item.internalCode}
                        </td>
                        <td className="text-left border border-[#e8e8e8] p-2">
                          {item.amount}
                        </td>
                        <td className="text-left border border-[#e8e8e8] p-2 w-[70%]">
                          <p>{item.name}</p>
                          <p>{item.internalCode}</p>
                        </td>
                        <td className="text-left border border-[#e8e8e8] p-2">
                          {bubble ? "ห่อ" : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <footer className="p-5 mt-5 border-2 border-black">
                <div
                  className="overflow-wrap break-words max-w-full"
                  dangerouslySetInnerHTML={{
                    __html: accountData?.properties?.packManual || "",
                  }}
                />
              </footer>
              {/* <div className="print:fixed print:bottom-0 print:right-0 print:p-2 print:text-[10px]">
                {index + 1}/{printedData.length}
              </div> */}
            </div>
          );
        })}
      </div>
    );
  }
);

OrderPrint.displayName = "OrderPrint";

export default OrderPrint;
