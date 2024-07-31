import { useQuery } from "@tanstack/react-query";
import {
  getDeliveryOrders,
  getDeliveryOrdersDetail,
} from "../endpoints/delivery-order";
import { DeliveryOrderDetailTypes, DeliveryOrderTypes } from "@/types";

export const useDeliveryOrdersQuery = () => {
  return useQuery<DeliveryOrderTypes[]>({
    queryKey: ["deliveryOrders"],
    queryFn: getDeliveryOrders,
  });
};

export const useDeliveryOrdersDetail = (page: number, per_page: number) => {
  return useQuery<DeliveryOrderDetailTypes[]>({
    queryKey: ["deliveryOrders-detail", page, per_page],
    queryFn: () => getDeliveryOrdersDetail(page, per_page),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
