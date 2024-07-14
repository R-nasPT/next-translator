import { baseUrl } from "@/services/baseUrl";

export async function GET() {
  try {
    const response = await baseUrl.get("/deliveryorder");

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
