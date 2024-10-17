import { getDeliveryOrdersId } from "@/services/endpoints/delivery-order";
import { OrderIdTypes } from "@/types";
import { useQueries, UseQueryResult } from "@tanstack/react-query";

export const useDeliveryorderIds = (orderIds: string[]): UseQueryResult<OrderIdTypes, Error>[] => {
  return useQueries({
    queries: orderIds.map((orderId) => ({
      queryKey: ["delivery-order-Ids", orderId],
      queryFn: () => getDeliveryOrdersId(orderId),
    })),
  });
};
