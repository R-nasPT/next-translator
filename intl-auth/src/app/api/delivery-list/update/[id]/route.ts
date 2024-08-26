import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";
import axios, { AxiosError } from "axios";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
console.log(body);

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);
  try {
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axiosInstance.put(`/deliveryorder/${id}`, body);
    return Response.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error updating delivery order:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        return Response.json(
          { error: axiosError.response.data },
          { status: axiosError.response.status }
        );
      } else if (axiosError.request) {
        return Response.json(
          { error: "No response received from server" },
          { status: 503 }
        );
      }
    }

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
