import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const page = Number(searchParams.get("page") || "1");
  // const per_page = Number(searchParams.get("per_page") || "10");

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  try {
    const response = await axiosInstance.get("/deliveryorder", {
      params: {
        $select:
          "id,accountId,code,reference,customerName,courierTrackingCode,status,courierId,itemCount,printCount,updatedDate,",
        $expand:
          "account,courier,items($select=amount;$expand=sku($select=info;$expand=info($select=onHand))),attachments",
      },
    });

    if (!response) {
      return Response.json({ error: "No data received" }, { status: 404 });
    }

    const sortedData = response.data.sort((a: any, b: any) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
    return Response.json(sortedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery orders:", error);

    return Response.json(
      { error: "Failed to fetch delivery orders" },
      { status: 500 }
    );
  }
}
