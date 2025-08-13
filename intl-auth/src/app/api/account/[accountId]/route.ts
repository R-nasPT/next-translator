import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
   const { accountId } = await params;
  
  const token = await getIdToken(request);
  const httpService = configureHttpServiceWithToken(token!);

  const response = await httpService.get(`/account/${accountId}`);

  if (response instanceof Response) {
    return Response.json({
        error: response,
        data: null,
      }, { status: response.status }
    );
  }

  return Response.json({
    data: response.data,
  }, { status: response.status });
}
