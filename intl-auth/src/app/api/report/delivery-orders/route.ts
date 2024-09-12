import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const merchant = searchParams.get("merchant");
  const filters = JSON.parse(searchParams.get("filters") || "[]");

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  let filter = "";
  if (startDate && endDate) {
    filter = `createdDate ge ${new Date(startDate).toISOString()} and createdDate le ${new Date(endDate).toISOString()}`;
  }

  if (merchant) {
    filter += filter ? ` and ` : "";
    filter += `accountId eq '${merchant}'`;
  }

  filters.forEach((condition: { field: string; value: string }, index: number) => {
    if (condition.field && condition.value) {
      filter += filter ? ` and ` : "";
      switch (condition.field) {
        case "code":
          filter += `contains(code, '${condition.value}')`;
          break;
        case "reference":
          filter += `contains(reference, '${condition.value}')`;
          break;
        case "customerName":
          filter += `contains(customerName, '${condition.value}')`;
          break;
        case "courier/name":
          filter += `contains(courier/name, '${condition.value}')`;
          break;
        default:
          break;
      }
    }
  });

  try {
    const response = await axiosInstance.get("/deliveryorder", {
      params: {
        $filter: filter,
        $select: "*",
        $expand: "courier($select=name),items",
      },
    });

    if (!response) {
      return Response.json({ error: "No data received" }, { status: 404 });
    }

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching delivery orders:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
