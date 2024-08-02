const statusList = [
  { name: "draft", color: "bg-[#979797]", count: 0 },
  { name: "pending", color: "bg-yellow-400", count: 20 },
  { name: "printed", color: "bg-blue-400", count: 17 }, 
  { name: "picked", color: "bg-purple-400", count: 35 },
  { name: "packed", color: "bg-pink-400", count: 335 },
  { name: "dispatched", color: "bg-green-400", count: 565 },
  { name: "cancelled", color: "bg-red-500", count: 46 },
];

export default function OrderStatusFilter({ status, handleStatusChange }: any) {
  return (
    <section className="hidden lg:flex py-5 gap-3 text-[13px] text-[#280d5f]">
      <span
        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300 ${
          !status ? "bg-gray-100" : ""
        }`}
        onClick={() => handleStatusChange("")}
      >
        All Status (3231)
      </span>
      {statusList.map((item) => (
        <div
          key={item.name}
          className={`flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-full transition-colors duration-300 ${
            status === item.name ? "bg-gray-100" : ""
          }`}
          onClick={() => handleStatusChange(item.name)}
        >
          <div className={`p-[6px] ${item.color} rounded-full`}></div>
          <span>
            {item.name} ({item.count})
          </span>
        </div>
      ))}
    </section>
  );
}
