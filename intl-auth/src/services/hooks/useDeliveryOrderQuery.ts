import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const usePrintDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (printId: string[]) => printDeliveryOrdersId(printId),
    onSuccess: (data, variables) => {
      // อัปเดต cache สำหรับ query ที่เกี่ยวข้อง
      queryClient.invalidateQueries({ queryKey: ['deliveryOrders-list'] });
      queryClient.invalidateQueries({ queryKey: ['deliveryOrdersId', variables] });

      // แสดงข้อความสำเร็จหรือทำการ redirect ถ้าจำเป็น
      console.log('พิมพ์เอกสารสำเร็จ1', data);
      console.log('พิมพ์เอกสารสำเร็จ2', variables);
    },
    onError: (error) => {
      // จัดการ error
      console.error('เกิดข้อผิดพลาดในการพิมพ์:', error);
      // แสดง error message หรือทำการ log
    },
    // ตัวเลือกเพิ่มเติม
    retry: 1, // ลองใหม่ 1 ครั้งถ้าเกิด error
    onSettled: () => {
      // ทำงานเมื่อ mutation เสร็จสิ้น ไม่ว่าจะสำเร็จหรือไม่
      console.log('การพิมพ์เสร็จสิ้น');
    },
  });
};
