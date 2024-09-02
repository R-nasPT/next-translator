import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../endpoints/location";
import { LocationType } from "@/types";

export const useLocation = () => {
  return useQuery<LocationType>({
    queryKey: ["location"],
    queryFn: fetchLocations,
  });
};
