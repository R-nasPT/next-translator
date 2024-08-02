import { FullStatusTypes } from "@/types";

type StatusColorScheme = {
  bg: string;
  border: string;
  text: string;
};

const STATUS_COLORS: Record<FullStatusTypes, StatusColorScheme> = {
  draft: {
    bg: "bg-[#979797]",
    border: "border-gray-400",
    text: "text-gray-700",
  },
  pending: {
    bg: "bg-yellow-400",
    border: "border-yellow-500",
    text: "text-yellow-600",
  },
  printed: {
    bg: "bg-blue-400",
    border: "border-blue-500",
    text: "text-blue-600",
  },
  picked: {
    bg: "bg-purple-400",
    border: "border-purple-500",
    text: "text-purple-700",
  },
  packed: {
    bg: "bg-pink-400",
    border: "border-pink-500",
    text: "text-pink-700",
  },
  dispatched: {
    bg: "bg-green-500",
    border: "border-green-600",
    text: "text-green-700",
  },
  cancelled: {
    bg: "bg-red-500",
    border: "border-red-600",
    text: "text-red-700",
  },
  delivered: {
    bg: "bg-teal-300",
    border: "border-teal-500",
    text: "text-teal-600",
  },
  Completed: {
    bg: "bg-lime-300",
    border: "border-lime-500",
    text: "text-lime-600",
  },
  Returned: {
    bg: "bg-orange-200",
    border: "border-orange-400",
    text: "text-orange-700",
  },
};

export default function StatusBadge({ status }: { status: FullStatusTypes }) {
  const colorScheme = STATUS_COLORS[status];

  return (
    <div
      className={`flex items-center gap-2 bg-white border ${colorScheme.border} ${colorScheme.text} text-[13px] cursor-pointer pl-1 pr-2 py-[.5px] w-fit rounded-full transition-colors duration-300`}
    >
      <div className={`p-[6px] rounded-full ${colorScheme.bg}`}></div>
      <span>{status}</span>
    </div>
  );
}
