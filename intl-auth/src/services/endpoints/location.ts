import { strapiUrl } from "../baseUrl";

export const fetchLocations = async () => {
  const response = await strapiUrl.get("/locations");
  return response.data;
};
