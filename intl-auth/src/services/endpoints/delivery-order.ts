import axios from "axios";

export const getDeliveryOrders = async () => {
  const response = await axios.get("/api/deliveryorder");
  return response.data;
};

export const getDeliveryOrdersDetail = async (page: number, per_page: number) => {
  const response = await axios.get("/api/deliveryorder-detail", {
    params: {
      page,
      per_page
    }
  });
  return response.data;
};
