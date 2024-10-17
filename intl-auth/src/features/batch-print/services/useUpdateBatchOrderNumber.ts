import { ApiHelperTypes, OrderIdTypes } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const updateBatchOrderNumber = async (body: OrderIdTypes[]) => {
    const response = await axios.put(`/api/deliveryorder-list/update/batch-update`, body);
    return response.data;
  };

  export const useUpdateBatchOrderNumber = () => {
    const queryClient = useQueryClient();
  
    return useMutation<ApiHelperTypes, Error, OrderIdTypes[]>({
      mutationFn: (body) => updateBatchOrderNumber(body),
      onSuccess: (result) => {
        console.log("Batch update result:", result);
  
        if (result && typeof result === 'object') {
          // ตรวจสอบว่า result.successful มีอยู่และเป็น array
          if (Array.isArray(result.successful)) {
            result.successful.forEach((updatedOrder) => {
              if (updatedOrder && updatedOrder.id) {
                queryClient.setQueryData(['deliveryOrders-list', updatedOrder.id], updatedOrder);
              }
            });
          }
  
          // ล้าง cache ทั้งหมดของ deliveryOrders-list
          queryClient.invalidateQueries({ queryKey: ['deliveryOrders-list'] });
  
          // ตรวจสอบจำนวน error (ถ้ามี)
          if (result.failureCount && result.failureCount > 0) {
            console.error("Some orders failed to update:", result.failed);
            // TODO: แสดงข้อความแจ้งเตือนผู้ใช้เกี่ยวกับ order ที่อัพเดทไม่สำเร็จ
          }
        } else {
          console.error("Unexpected result structure:", result);
        }
      },
      onError: (error) => {
        console.error("Error in batch update:", error);
        // TODO: จัดการกับข้อผิดพลาดที่เกิดขึ้น เช่น แสดงข้อความแจ้งเตือนผู้ใช้
      }
    });
  };
