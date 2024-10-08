export const dynamic = "force-dynamic"; //<-- ทำให้ไม่เกิด error ตอน yarn start
//เป็นคำสั่งใน Next.js ที่ใช้กำหนดให้หน้าหรือคอมโพเนนต์นั้นถูกเรนเดอร์แบบไดนามิก (dynamic rendering) โดยบังคับ 
//แม้ว่าจะสามารถเรนเดอร์แบบสแตติกได้ก็ตาม

// force-dynamic: บังคับให้หน้า (หรือคอมโพเนนต์) นี้เรนเดอร์แบบไดนามิกทุกครั้งที่มีการร้องขอจากผู้ใช้ 
// ไม่ว่าจะมีข้อมูลคงที่หรือไม่ ซึ่งหมายความว่าในทุก ๆ การร้องขอ (request) จะมีการเรนเดอร์ใหม่ 
// และข้อมูลจะไม่ได้ถูกแคชไว้ล่วงหน้า

// เมื่อไหร่ควรใช้:
// เมื่อข้อมูลที่แสดงผลบนหน้าหรือคอมโพเนนต์นั้นเปลี่ยนแปลงอยู่ตลอดเวลา และไม่สามารถแคชได้ เช่น ข้อมูลที่ดึงมาจาก API ที่เปลี่ยนแปลงอย่างรวดเร็ว หรือข้อมูลที่ขึ้นอยู่กับเฮดเดอร์ (headers) หรือคุกกี้ (cookies) ของผู้ใช้

// ตัวอย่างสถานการณ์ที่เหมาะสม:
// หน้าแดชบอร์ดที่มีข้อมูลแบบเรียลไทม์
// คอมโพเนนต์ที่ดึงข้อมูลจากแหล่งข้อมูลที่เปลี่ยนแปลงบ่อย

import BatchPrintModal from "@/components/batch-print/BatchPrintModal";

export default function InterceptorBathPrint() {
  return <BatchPrintModal />;
}
