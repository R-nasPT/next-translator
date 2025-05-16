import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th"],
  defaultLocale: "th",
  // 'as-needed' (ค่าเริ่มต้น)	default locale ไม่มี prefix, ที่เหลือมี	/about (th), /en/about
  localePrefix: "as-needed" 
  // 'always'	ทุก locale มี prefix	/th/about, /en/about 
  localePrefix: "always" 
  // ไม่ใช้ prefix กับทุก locale	/about สำหรับทุกภาษา (ต้องใช้ cookies หรือตรวจ IP)
  localePrefix: "never" 
});
