import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDeliveryOrders,
  getDeliveryOrdersId,
  getDeliveryOrdersList,
} from "../endpoints/delivery-order";
import {
  DeliveryOrderContainerTypes,
  DeliveryOrderTypes,
  OrderIdTypes,
} from "@/types";

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
    refetchInterval: 2 * 60 * 1000,
    // staleTime: 5 * 60 * 1000,
  });
};

export const useDeliveryOrdersId = (orderId: string) => {
  return useQuery<OrderIdTypes>({
    queryKey: ["deliveryOrdersId", orderId],
    queryFn: () => getDeliveryOrdersId(orderId),
    enabled: !!orderId, // ไม่ query ถ้า orderId เป็น empty string
  });
};

// prefetchQuery เป็นการดึงข้อมูลล่วงหน้า กรณีนี้ใช้เมื่อเอาเมาส์ไป hover แล้วก็จะดึงข้อมูลมาเลย ทำให้ fetch ข้อมูลเร็วมาก
export const usePrefetchOrderId = () => {
  const queryClient = useQueryClient();

  const prefetchOrderData = (orderId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["deliveryOrdersId", orderId],
      queryFn: () => getDeliveryOrdersId(orderId),
    });
  };

  return prefetchOrderData;
};
