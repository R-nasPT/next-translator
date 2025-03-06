export interface QueryParams<T> {
  searchParams: Promise<{
    [K in keyof T]: T[K];
  }>;
  params: Promise<{ locale: string }>;
}

// ------------- examp ---------------
import { QueryParams } from "@/types";
import { redirect } from "next/navigation";
import BatchPrintModal from "@/features/batch-print/components/BatchPrintModal";

interface BatchPrintParams {
  merchant?: string
  couriers?: string
  cutoffTime: string
}

type BatchPrintProps = QueryParams<BatchPrintParams>;

export default async function BatchPrint(props: BatchPrintProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const initialFilters = {
    merchant: searchParams.merchant,
    couriers: searchParams.couriers,
    cutoffTime: searchParams.cutoffTime,
  };

  if (!initialFilters.cutoffTime) {
    redirect(`/${params.locale}/batch-print?cutoffTime=1`);
  }

  return <BatchPrintModal initialFilters={initialFilters} />;
}
