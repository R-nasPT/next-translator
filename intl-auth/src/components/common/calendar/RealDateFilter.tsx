import Datepicker from "react-tailwindcss-datepicker";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

interface DateFilterProps {
  onDateChange: (dates: [Date | null, Date | null]) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  enableSearchParams?: boolean;
  rounded?: "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}
type DateValueType = { startDate: Date | null; endDate: Date | null } | null;

export default function DateFilter({
  onDateChange,
  startDate: propStartDate,
  endDate: propEndDate,
  enableSearchParams = false,
  rounded,
}: DateFilterProps) {
  const locale = useLocale();
  const searchParams = useSearchParams();

  let startDate = propStartDate ?? null;
  let endDate = propEndDate ?? null;

  if (enableSearchParams) {
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    startDate = startDateParam ? new Date(startDateParam) : null;
    endDate = endDateParam ? new Date(endDateParam) : null;
  }

  const handleDateChange = (newValue: DateValueType) => {
    if (newValue && newValue.startDate) {
      let startDate = new Date(newValue.startDate);
      let endDate: Date;

      if (newValue.endDate) {
        endDate = new Date(newValue.endDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
      }

      startDate.setHours(0, 0, 0, 0);

      onDateChange([startDate, endDate]);
    } else {
      onDateChange([null, null]);
    }
  };

  const roundedClasses: { [key: string]: string } = {
    md: "rounded-r-md",
    lg: "rounded-r-lg",
    xl: "rounded-r-xl",
    "2xl": "rounded-r-2xl",
    "3xl": "rounded-r-3xl",
    "full": "rounded-r-full",
  };

  return (
    <Datepicker
      useRange={false}
      primaryColor={"purple"}
      value={{
        startDate: startDate,
        endDate: endDate,
      }}
      onChange={handleDateChange}
      i18n={locale}
      maxDate={new Date()}
      displayFormat="DD/MM/YYYY"
      placeholder="DD/MM/YYYY"
      containerClassName={`flex-1 relative rounded-${rounded}`}
      inputClassName={`border border-[#331767] rounded-${rounded} w-full px-5 py-2 focus:outline-none focus:ring-4 focus:ring-purple-200`}
      toggleClassName={`absolute bg-purple-400 text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
        roundedClasses[rounded || ""]
      }`}
    />
  );
}
