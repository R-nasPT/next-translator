import { useAccountIds, useMultiSkuId } from "@/services";
import { DeliveryOrderPrint } from "@/types";

const useOrderPrint = (printedData: DeliveryOrderPrint[]) => {
  const accountQueries = useAccountIds(
    printedData.map((data) => data.accountId)
  );

  const allSkuIds = printedData.flatMap((data) =>
    data.items.map((item) => item.skuId)
  );

  const skuQueries = useMultiSkuId(allSkuIds);

  const allQueriesSuccess = accountQueries.every((query) => query.isSuccess);
  const allSkuQueriesSuccess = skuQueries.every((query) => query.isSuccess);

  return {
    accountQueries,
    skuQueries,
    allQueriesSuccess,
    allSkuQueriesSuccess,
  };
};

export default useOrderPrint;
