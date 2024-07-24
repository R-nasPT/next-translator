import { getSession } from "@/libs/getSession";
import { createAxiosInstance } from "@/services/baseUrl";

export async function GET() {
  const session = await getSession()
  const axiosInstance = createAxiosInstance((session?.user as any)?.token);
  
  const filterStart = new Date();
  filterStart.setDate(filterStart.getDate() - 1);
  filterStart.setHours(8, 0, 0);
  const filterEnd = new Date();
  filterEnd.setHours(16, 15, 0);
  try {
    const response = await axiosInstance.get("/deliveryorder", {
      params: {
        $filter: `createdDate ge ${filterStart.toISOString()} and createdDate le ${filterEnd.toISOString()}`,
        $select:
          "id,status,accountId,updatedDate,createdDate,dispatchDate,courierId,propertiesJson",
      },
    });

    if (!response) {
      return Response.json({ error: "No data received" }, { status: 404 });
    }

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery orders:", error);

    return Response.json(
      { error: "Failed to fetch delivery orders" },
      { status: 500 }
    );
  }
}
