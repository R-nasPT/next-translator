import { useQueries } from "@tanstack/react-query";
import { fetchSkuId } from "../endpoints/sku";

export const useSkuId = (skuIds: string[]) => {
    return useQueries({
      queries: skuIds.map(skuId => ({
        queryKey: ['sku', skuId],
        queryFn: () => fetchSkuId(skuId),
        enabled: !!skuId,
      })),
    });
  };
