import { StatusTypes } from "@/types";

interface OrderStatusFilterProps {
  status: string | undefined;
  handleStatusChange: (status: string) => void;
  statusResponse: StatusTypes[];
}

const initialStatusCounts: Record<StatusTypes, number> = {
  draft: 0,
  pending: 0,
  printed: 0,
  picked: 0,
  packed: 0,
  dispatched: 0,
  cancelled: 0,
};

const statusList = [
  { name: "draft", color: "bg-[#979797]" },
  { name: "pending", color: "bg-yellow-400" },
  { name: "printed", color: "bg-blue-400" },
  { name: "picked", color: "bg-purple-400" },
  { name: "packed", color: "bg-pink-400" },
  { name: "dispatched", color: "bg-green-400" },
  { name: "cancelled", color: "bg-red-500" },
];

export default function OrderStatusFilter({ status, handleStatusChange, statusResponse }: OrderStatusFilterProps) {
  // สร้าง Set ของ status ที่เราต้องการ
  const validStatuses = new Set(statusList.map((item) => item.name));

  const statusCounts = (statusResponse || []).reduce(
    (acc, currentStatus) => {
      acc[currentStatus] = (acc[currentStatus] || 0) + 1;
      return acc;
    },
    { ...initialStatusCounts }
  );

  // คำนวณ allStatus โดยรวมเฉพาะ status ที่อยู่ใน validStatuses
  const allStatus = (statusResponse || []).reduce((sum, currentStatus) => {
    // ตรวจสอบว่า status นั้นอยู่ใน validStatuses หรือไม่
    if (validStatuses.has(currentStatus)) {
      return sum + 1;
    }
    return sum;
  }, 0);

  return (
    <section className="hidden lg:flex py-5 gap-1 text-[13px] text-[#280d5f]">
      <span
        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300 ${
          !status ? "bg-gray-100" : ""
        }`}
        onClick={() => handleStatusChange("")}
      >
        All Status ({allStatus})
      </span>
      {statusList.map((item) => (
        <div
          key={item.name}
          className={`flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300 capitalize ${
            status === item.name ? "bg-gray-100" : ""
          }`}
          onClick={() => handleStatusChange(item.name)}
        >
          <div className={`p-[6px] ${item.color} rounded-full`}></div>
          <span>
            {item.name} ({statusCounts[item.name as StatusTypes]})
          </span>
        </div>
      ))}
    </section>
  );
}
