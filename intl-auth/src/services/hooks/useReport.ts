import { useQuery } from "@tanstack/react-query";
import { fetchDeliveryOrderReport } from "../endpoints/report";
import { DeliveryOrderReport, FilterCondition } from "@/types";

export const useReportOrders = (
  startDate?: string | null,
  endDate?: string | null,
  merchant?: string | null,
  filters?: FilterCondition[]
) => {
  return useQuery<DeliveryOrderReport[]>({
    queryKey: ["reportOrders", startDate, endDate, merchant, filters],
    queryFn: () =>
      fetchDeliveryOrderReport(startDate, endDate, merchant, filters),
    enabled: !!startDate && !!endDate,
  });
};
