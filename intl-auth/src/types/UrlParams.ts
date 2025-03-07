export interface SearchParams<T> {
  searchParams: Promise<{
    [K in keyof T]: T[K];
  }>;
}

export interface RouteParams<T> {
  params: Promise<{
    [K in keyof T]: T[K];
  }>;
}

// ----------------- examp ---------------------

export const dynamic = "force-dynamic";

import { RouteParams, SearchParams } from "@/types";
import { redirect } from "next/navigation";
import BatchPrintModal from "@/features/batch-print/components/BatchPrintModal";

interface BatchPrintParams {
  merchant?: string
  couriers?: string
  cutoffTime: string
}

type BatchPrintProps = SearchParams<BatchPrintParams> & RouteParams<{ locale: string }>;

export default async function BatchPrint(props: BatchPrintProps) {
  const { locale } = await props.params;
  const searchParams = await props.searchParams;

  const initialFilters = {
    merchant: searchParams.merchant,
    couriers: searchParams.couriers,
    cutoffTime: searchParams.cutoffTime,
  };

  if (!initialFilters.cutoffTime) {
    redirect(`/${locale}/batch-print?cutoffTime=1`);
  }

  return <BatchPrintModal initialFilters={initialFilters} />;
}
