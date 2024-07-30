import React from "react";
import Checkbox from "../ui/checkbox";

export default function OederListSkeleton() {
  return (
    <>
      <table className="hidden lg:table w-full text-sm text-[#280d5f] text-left">
        <thead>
          <tr className="border-b border-[#e0e0e0]">
            <th className="p-1">
              <Checkbox id="0" disabled={true} />
            </th>
            <th className="font-normal p-4">Code</th>
            <th className="font-normal p-4">Reference</th>
            <th className="font-normal p-4">Courier</th>
            <th className="font-normal p-4">COD / Count</th>
            <th className="font-normal p-4">Last Update</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, index) => (
            <tr key={index} className="border-b border-[#e0e0e0]">
              <td className="p-1">
                <Checkbox id={String(index + 1)} disabled={true} />
              </td>
              <td className="flex flex-col gap-1 items-center p-4">
                <div className="py-2 w-4/5 rounded-full bg-slate-200 animate-pulse"></div>
                <div className="py-[6px] w-1/2 rounded-full bg-slate-200 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="py-2 w-4/5 rounded-full bg-slate-200 animate-pulse"></div>
              </td>
              <td className="flex flex-col gap-1 p-4">
                <div className="py-2 w-full rounded-full bg-slate-200 animate-pulse"></div>
                <div className="py-[6px] w-1/2 rounded-full bg-slate-200 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="py-2 w-1/5 rounded-full bg-slate-200 animate-pulse"></div>
              </td>
              <td className="p-4">
                <div className="py-2 w-4/5 rounded-full bg-slate-200 animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
