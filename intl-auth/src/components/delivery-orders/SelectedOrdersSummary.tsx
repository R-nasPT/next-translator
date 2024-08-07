import React from "react";

interface SelectedOrdersSummaryProps {
  selectedCount: number;
  selectedIds: string[];
  onCancelSelected?: () => void;
}

export default function SelectedOrdersSummary({
  selectedCount,
  selectedIds,
  onCancelSelected,
}: SelectedOrdersSummaryProps) {
  return (
    <div className="bg-[#eee8fa] flex justify-between items-center py-5 px-3 my-3 lg:my-0">
      <div>Selected {selectedCount} item(s)</div>
      <div className="text-sm">Selected IDs: {selectedIds.join(", ")}</div>
      <div>
        <button
          onClick={onCancelSelected}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          ยกเลิก Order ที่เลือก
        </button>
      </div>
    </div>
  );
}
