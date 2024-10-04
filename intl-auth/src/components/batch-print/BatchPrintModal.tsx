"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui";
import { useDeliveryCutOf } from "@/services";
import { filterCutOffTimes } from "@/helpers";

export default function BatchPrintModal() {
  const [selectedFilter, setSelectedFilter] = useState('1');
  const [filteredOrders, setFilteredOrders] = useState<any>([]);

  const {data: orders, refetch} = useDeliveryCutOf()

  useEffect(() => {
    if (orders) {
      const currentTime = new Date();
      const testFilteredOrders = filterCutOffTimes(orders, selectedFilter, currentTime);
      setFilteredOrders(testFilteredOrders);
      // console.log(testFilteredOrders)
    }
  }, [orders, selectedFilter]);

  
console.log(filteredOrders)
  return (
    <Modal>
      <div className="bg-white p-5 h-[90vh] lg:h-[55vh] w-[90vw] lg:w-[55vw] rounded-3xl">

      <h1>พิมพ์ ใบปะหน้า / Batch Print</h1>
      <input type="text" />
      <input type="text" />

      {/* <div>
      <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
        <option value="0">Filter 0</option>
        <option value="1">Filter 1</option>
        <option value="2">Filter 2</option>
      </select>
      <ul>
        {filteredOrders.map((order: any) => (
          <li key={order.id}>{order.id}</li>
        ))}
      </ul>
      <button onClick={() => refetch()}>Reload</button>
    </div> */}

      {/* --- Desktop --- */}
      <div className="overflow-auto h-[85%] hidden lg:block">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-white">
            <tr>
              <td className="p-2 border-b border-[#eaeaea]">Internal Code</td>
              <td className="p-2 border-b border-[#eaeaea]">quantity</td>
              <td className="p-2 border-b border-[#eaeaea]">stock</td>
              <td className="p-2 border-b border-[#eaeaea]">จำนวน Order</td>
              <td className="p-2 border-b border-[#eaeaea]"></td>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr key={index}>
                <td className="p-2 border-b border-[#eaeaea]">
                  (2x) 0DX00112, (2x) 0DX00113, (2x) 0DX00114, (30x) 0DX00252
                </td>
                <td className="p-2 border-b border-[#eaeaea]">0DX</td>
                <td className="p-2 border-b border-[#eaeaea]">PBC.WH.SUK</td>
                <td className="p-2 border-b border-[#eaeaea]">1</td>
                <td className="p-2 border-b border-[#eaeaea]">
                  <button className="bg-green-500 rounded-md text-white px-2 py-1">
                    เลือก
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Mobile --- */}
      <section className="w-full h-[90%] lg:hidden text-sm overflow-auto">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="py-3 px-3 border-b border-[#e0e0e0]">
            <div className="flex gap-3">
              <div className="w-1/2">
                <span className="text-[#280d5f] font-semibold">
                  Internal Code
                </span>
                <p className="text-[#7a6eaa] text-xs !break-words">
                  (2x) 0DX00112, (2x) 0DX00113, (2x) 0DX00114, (30x) 0DX00252
                </p>
                <span className="text-[#280d5f] font-semibold flex items-center gap-2">
                  quantity: <p className="text-[#7a6eaa]">23</p>
                </span>
              </div>
              <div className="w-1/2">
                <span className="text-[#280d5f] font-semibold ">stock</span>
                <p className="text-[#7a6eaa] text-xs">asdsss</p>
                <span className="text-[#280d5f] font-semibold flex items-center gap-2">
                  จำนวน Order: <p className="text-[#7a6eaa]">54</p>
                </span>
              </div>
            </div>
            <button className="bg-green-500 rounded-md text-white px-2.5 py-1.5 mt-2">
              เลือก
            </button>
          </div>
        ))}
      </section>
        </div>
    </Modal>
  );
}
