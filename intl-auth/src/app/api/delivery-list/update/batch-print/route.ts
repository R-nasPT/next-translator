import { processMultiple } from "@/helpers";
import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function PUT(request: Request) {
  const body = await request.json();

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  try {
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!Array.isArray(body)) {
      return Response.json({ error: "Invalid input: expected an array of orders" }, { status: 400 });
    }

    const result = await processMultiple(body, 
      (order) => axiosInstance.put(`/deliveryorder/${order.id}`, order)
    );

    return Response.json({
      message: `Launchpad batch number update finished. Successes: ${result.successCount} Failures: ${result.failureCount}`,
      ...result
    }, { status: 200 });

  } catch (error) {
    console.error("Error processing batch update:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
