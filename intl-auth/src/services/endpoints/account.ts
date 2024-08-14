import axios from "axios";

export const fetchAccountId = async (accountId: string) => {
  const response = await axios.get(`/api/account/${accountId}`);
  return response.data;
};
