import dynamic from "next/dynamic";

const BatchPrintModal = dynamic(
  () => import("@/components/batch-print/BatchPrintModal"),
  { ssr: false }
);

export default function BatchPrint() {
  return (
    <BatchPrintModal />
  );
}
