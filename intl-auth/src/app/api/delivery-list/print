export async function POST(req: Request) {
  const rawData = await req.text();

  // แปลงข้อมูลเป็น JSON (ถ้าข้อมูลเป็น JSON)
  const orderId = JSON.parse(rawData);
  console.log(orderId.printId[0]);

  return Response.json({ message: "ได้รับข้อมูลแล้ว" });
}
