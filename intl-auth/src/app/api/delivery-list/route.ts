import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");
  const status = searchParams.get("status");

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);
  
  // 1 Year or 3 Year
  // const startDate = new Date();
  // // threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  // startDate.setMonth(0);
  // startDate.setDate(1);
  // startDate.setHours(0, 0, 0, 0);

  const currentDate = new Date();
  // Two Week
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 14);
  startDate.setHours(0, 0, 0, 0);

  let filter = `updatedDate ge ${startDate.toISOString()} and updatedDate le ${currentDate.toISOString()}`;
  if (status) {
    filter += ` and status eq '${status}'`;
  }

  try {
    const response = await axiosInstance.get("/deliveryorder", {
      params: {
        $filter: filter,
        $orderby: "updatedDate desc",
        $select:
          "id,accountId,code,reference,customerName,courierTrackingCode,status,courierId,itemCount,printCount,updatedDate",
        $expand: "account,courier",
        $skip: (page - 1) * perPage,
        $top: perPage,
        $count: true,
      },
    });

    const totalResponse = await axiosInstance.get("/deliveryorder", {
      params: {
        $filter: filter,
        $select: "id,status",
      },
    });

    if (!response || !totalResponse) {
      return Response.json({ error: "No data received" }, { status: 404 });
    }

    const statuses = totalResponse.data.map((item: { status: string }) => item.status);

    return Response.json(
      {
        data: response.data,
        total: totalResponse.data.length,
        status: statuses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching delivery orders:", error);

    return Response.json(
      { error: "Failed to fetch delivery orders" },
      { status: 500 }
    );
  }
}
