"use client";
import { useCheckbox } from "@/hooks";
import Checkbox from "../ui/checkbox";

export default function OrderTable({ orders }: any) {
  const {
    handleSelectAll,
    handleSelectItem,
    isAllSelected,
    selectedCount,
    selectedItems,
  } = useCheckbox(orders);
  return (
    <>
      {selectedCount > 0 && (
        <div className="bg-[#eee8fa] py-5 px-3">
          Selected {selectedCount} item(s)
        </div>
      )}
      {/* ----- Desktop ----- */}
      <table className="hidden lg:table w-full text-sm text-[#280d5f] text-left">
        <thead>
          <tr className="border-b border-[#e0e0e0]">
            <th className="p-1">
              <Checkbox
                id="selectAll"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th className="font-normal p-4">Code</th>
            <th className="font-normal p-4">Reference</th>
            <th className="font-normal p-4">Courier</th>
            <th className="font-normal p-4">COD / Count</th>
            <th className="font-normal p-4">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr
              key={order.id}
              className={`border-b border-[#e0e0e0] ${
                selectedItems[order.id] ? "bg-[#eee8fa]" : ""
              }`}
            >
              <td className="p-1">
                <Checkbox
                  id={`row-${order.id}`}
                  checked={selectedItems[order.id] || false}
                  onChange={handleSelectItem(order.id)}
                />
              </td>
              <td className="p-4 flex flex-col gap-1 items-center">
                <div className="flex items-center gap-2 border border-[#a07ee4] text-[#7645d9] text-[13px] cursor-pointer hover:bg-gray-100 pl-1 pr-2 py-[.5px] w-fit rounded-full transition-colors duration-300">
                  <div className="p-[6px] bg-[#ffb864] rounded-full"></div>
                  <span>Pending </span>
                </div>
                <p className="text-[13px] text-[#7c70ab]">2407-0G4-01643</p>
              </td>
              <td className="p-4">
                <p className="font-semibold">PO-202407025</p>
                <p className="text-[#846eae]">คุณ เจน ฟหกะ</p>
              </td>
              <td className="p-4 whitespace-nowrap">
                <p className="font-semibold">
                  TikTok Pickup (เจ้าหน้าที่มารับที่โกดัง)
                </p>
                <p className="text-[#846eae]">TH01105WT86K9E</p>
              </td>
              <td className="p-4">520 / 4</td>
              <td className="p-4">Thu 11 Jul 2024 09:37:17</td>
            </tr>
          ))}
          <tr className={`border-b border-[#e0e0e0]`}>
            <td className="p-1">
              <Checkbox
                id={`row-1`}
                // checked={selectedItems[order.id] || false}
                // onChange={handleSelectItem(order.id)}
              />
            </td>
            <td className="p-4 flex flex-col gap-1 items-center">
              <div className="flex items-center gap-2 border border-[#a07ee4] text-[#7645d9] text-[13px] cursor-pointer hover:bg-gray-100 pl-1 pr-2 py-[.5px] w-fit rounded-full transition-colors duration-300">
                <div className="p-[6px] bg-[#ffb864] rounded-full"></div>
                <span>Pending </span>
              </div>
              <p className="text-[13px] text-[#7c70ab]">2407-0G4-01643</p>
            </td>
            <td className="p-4">
              <p>PO-202407025</p>
              <p>คุณ เจน ฟหกะ</p>
            </td>
            <td className="p-4 whitespace-nowrap">
              <p>TikTok Pickup (เจ้าหน้าที่มารับที่โกดัง)</p>
              <p className="text-[#846eae]">TH01105WT86K9E</p>
            </td>
            <td className="p-4">- / 0</td>
            <td className="p-4">Thu 11 Jul 2024 09:37:17</td>
          </tr>
        </tbody>
      </table>

      {/* ----- Mobile ----- */}
      <table className="w-full lg:hidden">
        <tbody>
          <tr className="border-b border-[#e0e0e0]">
            <td className="p-4">
              <span className="text-[#7a6eaa] text-xs">Customer Name</span>
              <p className="text-[#280d5f] font-semibold">ท***ียา</p>
              <p className="text-[#7a6eaa]">2407-0G4-00803</p>
              <div className="flex items-center gap-2 border border-[#a07ee4] text-[#7645d9] text-[13px] cursor-pointer hover:bg-gray-100 pl-1 pr-2 py-[.5px] w-fit rounded-full transition-colors duration-300">
                <div className="p-[6px] bg-[#ffb864] rounded-full"></div>
                <span>Pending </span>
              </div>
            </td>
            <td className="p-4">
              <span className="text-[#7a6eaa] text-xs">Tracking Number</span>
              <p className="text-[#280d5f]">
                TikTok Pickup (เจ้าหน้าที่มารับที่โกดัง)
              </p>
              <p className="text-[#7a6eaa]">TH01105WT86K9E</p>
            </td>
          </tr>
          <tr className="border-b border-[#e0e0e0]">
            <td className="p-4">
              <span className="text-[#7a6eaa] text-xs">Customer Name</span>
              <p className="text-[#280d5f] font-semibold">ท***ียา</p>
              <p className="text-[#7a6eaa]">2407-0G4-00803</p>
              <div className="flex items-center gap-2 border border-[#a07ee4] text-[#7645d9] text-[13px] cursor-pointer hover:bg-gray-100 pl-1 pr-2 py-[.5px] w-fit rounded-full transition-colors duration-300">
                <div className="p-[6px] bg-[#ffb864] rounded-full"></div>
                <span>Pending </span>
              </div>
            </td>
            <td className="p-4">
              <span className="text-[#7a6eaa] text-xs">Tracking Number</span>
              <p className="text-[#280d5f]">
                TikTok Pickup (เจ้าหน้าที่มารับที่โกดัง)
              </p>
              <p className="text-[#7a6eaa]">TH01105WT86K9E</p>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
