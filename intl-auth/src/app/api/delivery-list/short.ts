import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

async function fetchData(axiosInstance: any, params: any) {
  const response = await axiosInstance.get("/deliveryorder", { params });
  if (!response || !response.data) {
    throw new Error("No data received");
  }
  return response.data;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "10");
  const status = searchParams.get("status");
  const merchant = searchParams.get("merchant");
  const search = searchParams.get("search");
  const field = searchParams.get("field");

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  const currentDate = new Date();
  // Two Week
  const startDate = new Date(currentDate);
  startDate.setDate(currentDate.getDate() - 14);
  startDate.setHours(0, 0, 0, 0);

  let filter = `updatedDate ge ${startDate.toISOString()} and updatedDate le ${currentDate.toISOString()}`;
  let statusFilter = `updatedDate ge ${startDate.toISOString()} and updatedDate le ${currentDate.toISOString()}`;
  
  if (status) filter += ` and status eq '${status}'`;
  
  if (merchant) {
    filter += ` and accountId eq '${merchant}'`
    statusFilter += ` and accountId eq '${merchant}'`
  };

  if (search) {
    const searchFields = field ? [field] : ['code', 'reference', 'customerName', 'courier/name'];
    filter += ` and (${searchFields.map(f => `contains(${f},'${search}')`).join(' or ')})`;
    statusFilter += ` and (${searchFields.map(f => `contains(${f},'${search}')`).join(' or ')})`;
  }

  try {
    // Fetch paginated data
    const paginatedData = await fetchData(axiosInstance, {
      $filter: filter,
      $orderby: "updatedDate desc",
      $select: "id,accountId,code,reference,customerName,courierTrackingCode,status,courierId,itemCount,printCount,updatedDate,cod,propertiesJson,note",
      $expand: "account,courier",
      $skip: (page - 1) * perPage,
      $top: perPage,
      $count: true,
    });

    // Fetch total count
    const totalData = await fetchData(axiosInstance, {
      $filter: filter,
      $orderby: "updatedDate desc",
      $select: "id",
    });

    // Fetch status data
    const statusData = await fetchData(axiosInstance, {
      $filter: statusFilter,
      $orderby: "updatedDate desc",
      $select: "status",
    });

    if (!paginatedData || !totalData || !statusData) {
      return Response.json({ error: "No data received" }, { status: 404 });
    }

    const statuses = statusData.map((item: { status: string }) => item.status);

    return Response.json(
      {
        data: paginatedData,
        total: totalData.length,
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
