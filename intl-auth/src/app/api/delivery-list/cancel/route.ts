import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";
import axios from "axios";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async (fn: () => Promise<any>, retries = 0, maxRetries = 5): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries >= maxRetries || !(axios.isAxiosError(error) && error.response?.status === 429)) {
      throw error;
    }
    const delayTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
    console.log(`Rate limit hit. Retrying after ${delayTime.toFixed(2)}ms...`);
    await delay(delayTime);
    return retryWithBackoff(fn, retries + 1, maxRetries);
  }
};

export async function POST(req: Request) {
  const rawData = await req.text();
  const { orderIds, messageText } = JSON.parse(rawData) as { orderIds: string[], messageText: string };

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  const processOrder = async (id: string, index: number) => {
    await delay(index * 500);
    try {
      await retryWithBackoff(() => 
        axiosInstance.post(`/deliveryorder/${id}/cancel`, { messageText })
      );

      console.log(`Successfully cancelled order ${id}`);
      return { id, status: 'fulfilled' as const };
    } catch (error: any) {
      console.error(`Failed to cancel order ${id}:`, error.message);
      return Promise.reject({ id, reason: error.message || 'An unexpected error occurred'});
    }
  };

  const results = await Promise.allSettled(
    orderIds.map((id, index) => processOrder(id, index))
  );

  const successful = results
    .filter((r): r is PromiseFulfilledResult<{id: string, status: 'fulfilled'}> => r.status === 'fulfilled')
    .map(r => r.value.id);

  const failed = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => ({ id: (r.reason as any).id, error: (r.reason as any).reason }));

  return Response.json({
    message: "Operation completed",
    successfulCancellations: successful,
    failedCancellations: failed,
    messageText
  });
}
