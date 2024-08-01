import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function GET(request: Request) {
  // const { searchParams } = new URL(request.url);
  // const page = Number(searchParams.get("page") || "1");
  // const per_page = Number(searchParams.get("per_page") || "10");

  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

  // คำนวณวันที่ของสามปีที่แล้ว
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
  threeYearsAgo.setMonth(0); // เดือนมกราคม
  threeYearsAgo.setDate(1); // วันที่ 1
  threeYearsAgo.setHours(0, 0, 0, 0); // เวลา 00:00:00.000

  // คำนวณวันที่สองปีที่แล้ว
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  // คำนวณวันที่ปีที่ผ่านมา
  const lastYear = new Date();
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  lastYear.setMonth(0); // เดือนมกราคม
  lastYear.setDate(1); // วันที่ 1
  lastYear.setHours(0, 0, 0, 0); // เวลา 00:00:00.000

  // คำนวณวันที่สิ้นสุดของปีที่ผ่านมา
  const endOfLastYear = new Date();
  endOfLastYear.setFullYear(endOfLastYear.getFullYear() - 1);
  endOfLastYear.setMonth(11); // เดือนธันวาคม
  endOfLastYear.setDate(31); // วันที่ 31
  endOfLastYear.setHours(23, 59, 59, 999); // เวลา 23:59:59.999

  // คำนวณวันที่เริ่มต้นของปีนี้
  const startOfYear = new Date();
  startOfYear.setMonth(0); // เดือนมกราคม
  startOfYear.setDate(1); // วันที่ 1
  startOfYear.setHours(0, 0, 0, 0); // เวลา 00:00:00.000

  // วันที่ปัจจุบัน
  const currentDate = new Date();

  try {
    const response = await axiosInstance.get("/deliveryorder", {
      params: {
        $filter: `updatedDate ge ${twoYearsAgo.toISOString()} and updatedDate le ${currentDate.toISOString()}`,
        $select:
          "id,accountId,code,reference,customerName,courierTrackingCode,status,courierId,itemCount,printCount,updatedDate,",
        $expand:
          "account,courier,items($select=amount;$expand=sku($select=info;$expand=info($select=onHand))),attachments",
        $orderby: "updatedDate desc", //<-- จะใช้ได้ก็ต่อเมื่อข้อมูลไม่เยอะเกินไป
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
