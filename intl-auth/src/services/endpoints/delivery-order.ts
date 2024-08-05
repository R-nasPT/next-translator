import axios from "axios";

export const getDeliveryOrders = async () => {
  const response = await axios.get("/api/deliveryorder");
  return response.data;
};

export const getDeliveryOrdersList = async (page: number, per_page: number, status?: string) => {
  const response = await axios.get("/api/deliveryorder-list", {
    params: {
      page,
      per_page,
      status,
    },
  });
  return response.data;
};

export const getDeliveryOrdersId = async (orderId: string) => {
  const response = await axios.get(`/api/deliveryorder-list/${orderId}`);
  return response.data;
};
