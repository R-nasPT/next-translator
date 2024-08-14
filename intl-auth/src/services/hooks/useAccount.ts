import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { fetchAccountId } from "../endpoints/account";
import { AccountId } from "@/types";

interface AccountResponse {
    data: AccountId;
  }

export function useAccountId(accountIds: string[]): UseQueryResult<AccountResponse, Error>[] {
  return useQueries({
    queries: accountIds.map((accountId) => ({
      queryKey: ["accountId", accountId],
      queryFn: () => fetchAccountId(accountId),
      retry: 1,
      onError: (error: any) => {
        console.error(`Error fetching account ${accountId}:`, error);
      },
    })),
  });
}
