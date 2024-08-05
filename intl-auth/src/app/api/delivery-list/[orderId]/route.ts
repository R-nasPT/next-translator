import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function GET(
  request: Request, //<-- จำเป็นต้องมี ถ้าไม่มีจะใช้ params ไม่ได้
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;
console.log(params);

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  try {
    const response = await axiosInstance.get(`/deliveryorder/${orderId}`);

    if (!response) {
      return Response.json(
        { error: "No data received for the specified order ID" },
        { status: 404 }
      );
    }

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery orders:", error);

    return Response.json(
      {
        error:
          "An error occurred while retrieving the delivery order. Please try again later.",
      },
      { status: 500 }
    );
  }
}
