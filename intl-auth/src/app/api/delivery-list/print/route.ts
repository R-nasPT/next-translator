import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function POST(req: Request) {
  try {
    // แปลงข้อมูลเป็น JSON (ถ้าข้อมูลเป็น JSON)
  // const orderId = JSON.parse(rawData);
  // console.log(orderId.printId[0]);
  const { printId } = JSON.parse(rawData);
    console.log("Received IDs:", printId);

    const session = await getSession();
    const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

    // สร้างอาเรย์ของ Promises สำหรับแต่ละ ID
    const printPromises = printId.map(id => 
      axiosInstance.post(`/deliveryorder/${id}/print`)
    );

    // รอให้ทุก Promise เสร็จสิ้น
    const results = await Promise.all(printPromises);

    // ประมวลผลผลลัพธ์
    const successfulPrints = results.filter(result => result.status === 200).length;
    const failedPrints = printId.length - successfulPrints;

    return Response.json({ 
      message: "การพิมพ์เสร็จสิ้น", 
      successful: successfulPrints, 
      failed: failedPrints 
    });

  } catch (error) {
    console.error("Error processing print requests:", error);
    return Response.json({ error: "เกิดข้อผิดพลาดในการประมวลผลคำขอพิมพ์" }, { status: 500 });
  }
}

// ----------------------------------------------

import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";

export async function POST(req: Request) {
  try {
    const rawData = await req.text();
    const { printId } = JSON.parse(rawData);
    console.log("Received IDs:", printId);

    const session = await getSession();
    const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);

    const printPromises = printId.map(async (id: string) => {
      try {
        const response = await axiosInstance.post(`/deliveryorder/${id}/print`);
        return {
          ...response.data,
          success: true,
        };
      } catch (error: any) {
        console.error(`Error printing order ${id}:`, error);
        return { id, success: false, error: error.message };
      }
    });

    const results = await Promise.all(printPromises);

    const successfulPrints = results.filter((result) => result.success);
    const failedPrints = results.filter((result) => !result.success);

    return Response.json({
      message: "การพิมพ์เสร็จสิ้น",
      successful: {
        count: successfulPrints.length,
        details: successfulPrints,
      },
      failed: {
        count: failedPrints.length,
        details: failedPrints,
      },
    });
  } catch (error) {
    console.error("Error processing print requests:", error);
    return Response.json(
      { error: "เกิดข้อผิดพลาดในการประมวลผลคำขอพิมพ์" },
      { status: 500 }
    );
  }
}
