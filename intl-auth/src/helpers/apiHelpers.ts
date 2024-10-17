import axios, { AxiosError, AxiosResponse } from "axios";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(fn: () => Promise<T>, retries = 0, maxRetries = 5): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries >= maxRetries || !(axios.isAxiosError(error) && error.response?.status === 429)) {
      throw error;
    }
    const delayTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
    console.log(`Rate limit hit. Retrying after ${delayTime.toFixed(2)}ms...`);
    await delay(delayTime);
    return retryWithBackoff(fn, retries + 1, maxRetries);
  }
};

type ItemWithId = { id: string };

const getItemId = <T>(item: T | ItemWithId): string => {
  if (typeof item === 'object' && item !== null && 'id' in item) {
    return item.id;
  }
  return item as string;
};

type ProcessedResult<T, R> = {
  id: string | number;
  item: T;
  status: 'fulfilled';
  data: R;
};

type ProcessError<T> = {
  id: string | number;
  item: T;
  reason: string;
};

const processItem = async <T, R>(
  item: T,
  apiCall: (item: T) => Promise<AxiosResponse<R>>,
): Promise<ProcessedResult<T, R>> => {
    const id = getItemId(item);
  try {
    const response = await retryWithBackoff(() => apiCall(item));
    console.log(`Successfully processed item ${JSON.stringify(item)}`);
    return { id, item, status: 'fulfilled', data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error processing item ${JSON.stringify(item)}:`, axiosError.message);
    return Promise.reject({ id, item, reason: {
        message: axiosError.message,
        data: axiosError.response?.data || 'No additional data available',
        config: axiosError.response?.config,
    }})
  }
};

type ProcessMultipleResult<T> = {
    successful: Array<{ id: string | number; item: T }>;
    failed: Array<{ id: string | number; item: T; error: string }>;
    totalProcessed: number;
    successCount: number;
    failureCount: number;
  };

export const processMultiple = async <T, R>(
  items: T[],
  apiCall: (item: T) => Promise<AxiosResponse<R>>
): Promise<ProcessMultipleResult<T>> => {
  const results = await Promise.allSettled(
    items.map((item) => processItem(item, apiCall))
  );

  const successful = results
    .filter((r): r is PromiseFulfilledResult<ProcessedResult<T, R>> => r.status === 'fulfilled')
    .map(r => ({ id: r.value.id, item: r.value.item }));

  const failed = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => ({ id: (r.reason as ProcessError<T>).id, item: (r.reason as ProcessError<T>).item, error: (r.reason as ProcessError<T>).reason }));

  return {
    successful,
    failed,
    totalProcessed: results.length,
    successCount: successful.length,
    failureCount: failed.length
  };
};

export default processMultiple
