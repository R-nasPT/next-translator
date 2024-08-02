import { useQuery } from "@tanstack/react-query";
import { getDeliveryOrders, getDeliveryOrdersList } from "../endpoints/delivery-order";
import { DeliveryOrderContainerTypes, DeliveryOrderTypes } from "@/types";

export const useDeliveryOrdersQuery = () => {
  return useQuery<DeliveryOrderTypes[]>({
    queryKey: ["deliveryOrders"],
    queryFn: getDeliveryOrders,
  }); 
};

export const useDeliveryOrdersList = (page: number, per_page: number, status?: string) => {
  return useQuery<DeliveryOrderContainerTypes>({
    queryKey: ["deliveryOrders-list", page, per_page, status],
    queryFn: () => getDeliveryOrdersList(page, per_page, status),
    placeholderData: (previousData) => previousData,
    refetchInterval: 3 * 60 * 1000,
    // staleTime: 5 * 60 * 1000,
  });
};
