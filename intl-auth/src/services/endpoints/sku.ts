import axios from "axios";

export const fetchSkuId = async (skuId: string) => {
  const response = await axios.get(`/api/sku/${skuId}`);
  return response.data;
};
