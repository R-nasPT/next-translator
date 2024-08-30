import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

interface DateFilterProps {
  onDateChange: (dates: [Date | null, Date | null]) => void;
}
type DateValueType = { startDate: Date | null; endDate: Date | null } | null;

export default function DateFilter({ onDateChange }: DateFilterProps) {
  const locale = useLocale();
  const [value, setValue] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  // const searchParams = useSearchParams();
  // const startDateParam = searchParams.get("startDate");
  // const endDateParam = searchParams.get("endDate");

  const handleDateChange = (newValue: DateValueType) => {
    setValue(newValue);

    if (newValue && newValue.startDate) {
      let startDate = new Date(newValue.startDate);
      let endDate: Date;

      if (newValue.endDate) {
        endDate = new Date(newValue.endDate);
        // ตั้งค่าเวลาเป็น 23:59:59 สำหรับวันสิ้นสุด
        endDate.setHours(23, 59, 59, 999);
      } else {
        // ถ้าไม่มีวันสิ้นสุด ให้ใช้วันเดียวกับวันเริ่มต้น
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      }

      // ตั้งค่าเวลาเป็น 00:00:00 สำหรับวันเริ่มต้น
      startDate.setHours(0, 0, 0, 0);

      onDateChange([startDate, endDate]);
    } else {
      onDateChange([null, null]);
    }
  };

  return (
    <Datepicker
      showShortcuts
      useRange={false}
      primaryColor={"purple"}
      value={value}
      // value={{
      //   startDate: startDateParam ? new Date(startDateParam) : null,
      //   endDate: endDateParam ? new Date(endDateParam) : null,
      // }}
      onChange={handleDateChange}
      i18n={locale}
      displayFormat="DD/MM/YYYY"
      placeholder="DD/MM/YYYY"
      containerClassName={`flex-1 relative rounded-3xl`}
      inputClassName={`border border-[#331767] rounded-3xl w-full px-5 py-2 focus:outline-none focus:ring-4 focus:ring-purple-200`}
      toggleClassName="absolute bg-purple-400 rounded-r-3xl text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
    />
  );
}
