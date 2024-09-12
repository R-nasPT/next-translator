export default function OrderReportSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_0_3px_rgba(0,0,0,0.3)] mb-5">
      <section className="flex gap-2 justify-between items-start lg:items-center">
        <div className="grid gap-2">
          <p className="py-2.5 w-[100px] lg:w-[150px] rounded-full bg-slate-200 animate-pulse"></p>
          <p className="py-2 w-[150px] lg:w-[250px] rounded-full bg-slate-200 animate-pulse"></p>
          <p className="py-2.5 w-[100px] lg:w-[200px] rounded-full bg-slate-200 animate-pulse"></p>
        </div>
        <button className="w-[130px] px-6 py-5 bg-slate-200 animate-pulse rounded-full"></button>
      </section>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr className="border-b border-[#e0e0e0]">
              {[...Array(8)].map((_, index) => (
                <th key={index} className="p-4">
                  <div className="py-2 w-[100px] rounded-full bg-slate-200 animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-[#e0e0e0] transition-colors duration-200"
              >
                {[...Array(8)].map((_, index) => (
                  <td key={index} className="p-4">
                    <div className="py-2 w-[100px] rounded-full bg-slate-200 animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
