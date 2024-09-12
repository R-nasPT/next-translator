import { FilterCondition } from "@/types";
import axios from "axios";

export const fetchDeliveryOrderReport = async (
  startDate?: string | null,
  endDate?: string | null,
  merchant?: string | null,
  filters?: FilterCondition[]
) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (merchant) params.append("merchant", merchant);
  if (filters) params.append("filters", JSON.stringify(filters));

  const response = await axios.get(
    `/api/report/delivery-orders?${params.toString()}`
  );
  return response.data;
};
