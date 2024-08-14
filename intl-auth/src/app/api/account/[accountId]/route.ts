import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  const { accountId } = params;
  try {
    const session = await getSession();
    const axiosInstance = configureAxiosWithToken(
      (session?.user as any)?.token
    );

    const response = await axiosInstance.get(`/account/${accountId}`);

    return Response.json({
      data: response.data,
    });
  } catch (error) {
    console.error("Error in GET function:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
