import { Link } from "@/navigation";
import { useAccountId, usePrintDelivery } from "@/services";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { OrderPrint } from "@/documents/print";
import { useReactToPrint } from "react-to-print";
import { DeliveryOrderPrint } from "@/types";

interface SelectedOrdersSummaryProps {
  selectedCount: number;
  selectedIds: string[];
  onCancelSelected?: () => void;
  status: string;
}

const statusActions = {
  printed: [{ text: "Pick", href: "/picked" }],
  picked: [{ text: "Pack", href: "/pack" }],
  packed: [{ text: "Dispatch", href: "/dispatch" }],
};

export default function SelectedOrdersSummary({
  selectedCount,
  selectedIds,
  onCancelSelected,
  status,
}: SelectedOrdersSummaryProps) {
  const t = useTranslations("BUTTON");
  const [printedData, setPrintedData] = useState<DeliveryOrderPrint[]>([]);
  const orderPrintRef = useRef<HTMLDivElement>(null);
  const { mutateAsync } = usePrintDelivery();

  const accountQueries = useAccountId(
    printedData.map((data) => data.accountId)
  );

  const handlePrint = useReactToPrint({
    content: () => orderPrintRef.current,
  });

  // ตรวจสอบว่าสถานะของ query ทั้งหมดสำเร็จหรือไม่
  const allQueriesSuccess = accountQueries.every((query) => query.isSuccess);

  useEffect(() => {
    if (printedData.length > 0 && allQueriesSuccess) {
      // ข้อมูลพร้อมแล้ว เริ่มการพิมพ์
      handlePrint();
    }
  }, [printedData, allQueriesSuccess]);

  const onHandlePrint = async () => {
    try {
      await mutateAsync(selectedIds, {
        onSuccess: (data) => {
          console.log("ผลการพิมพ์:", data);
          setPrintedData(data.successful.details);
        },
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการพิมพ์:", error);
    }
  };

  return (
    <>
      <div className="bg-[#eee8fa] flex justify-between items-center py-1 px-3 my-3 lg:my-0">
        <div>Selected {selectedCount} item(s)</div>
        <div className="text-sm">Selected IDs: {selectedIds.join(", ")}</div>
        <div className="flex gap-1">
          {status === "pending" &&
            renderButton("Print", onHandlePrint, "print")}

          {statusActions[status as keyof typeof statusActions]?.map(
            (action, index) =>
              selectedCount < 2
                ? renderLink(action.text, action.href, `status-action-${index}`)
                : null
          )}

          {selectedCount < 2 &&
            ["picked", "packed", "dispatched"].includes(status) &&
            renderButton("Print Label", onCancelSelected, "print-label")}

          {renderButton(t("CANCEL"), onCancelSelected, "cancel")}
          {renderButton(t("DOWNLOAD"), onCancelSelected, "export")}
        </div>
      </div>

      <section className="hidden">
        {printedData.length > 0 && (
          <OrderPrint ref={orderPrintRef} printedData={printedData} />
        )}
      </section>
    </>
  );
}

const renderLink = (text: string, href: string, key?: string) => {
  return (
    <Link
      key={key}
      href={href}
      className="text-[#7849da] hover:bg-[#d8c6fa] border border-[#7849da] my-1 px-3 py-1 text-sm rounded-xl transition-colors duration-300 grid justify-center items-center"
    >
      {text}
    </Link>
  );
};

const renderButton = (
  text: string,
  onClick: (() => void) | undefined,
  key?: string
) => {
  return (
    <button
      key={key}
      onClick={onClick}
      className="text-[#7849da] hover:bg-[#d8c6fa] border border-[#7849da] my-1 px-3 py-1 text-sm rounded-xl transition-colors duration-300"
    >
      {text}
    </button>
  );
};
