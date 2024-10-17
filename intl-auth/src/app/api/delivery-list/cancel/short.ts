import { processMultiple } from "@/helpers";
import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function POST(req: Request) {
  const rawData = await req.text();
  const { orderIds, messageText } = JSON.parse(rawData) as { orderIds: string[], messageText: string };

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  const result = await processMultiple(orderIds, 
    (id) => axiosInstance.post(`/deliveryorder/${id}/cancel`, { messageText })
  );
  return Response.json({
    message: "Cancel Order completed",
    ...result,
    messageText
  });
}
