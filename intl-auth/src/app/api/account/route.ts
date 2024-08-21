import { getSession } from "@/libs/getSession";
import { configureAxiosWithToken } from "@/services/baseUrl";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const axiosInstance = configureAxiosWithToken((session?.user as any)?.token);
  
  try {
  //   const session = await getSession(); <-- อยู่ใน try จะทำให้ next build ไม่ได้ เพราะมัน dynamic ต้องอยู่ด้านนอก
  //   const axiosInstance = configureAxiosWithToken((session?.user as any)?.token); <-- ตัวนี้ด้วย
    
    const response = await axiosInstance.get(`/account`);
    
    return NextResponse.json({
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching account data:", error);
    return NextResponse.json(
      { error: "Failed to fetch account data" },
      { status: 500 }
    );
  }
}
