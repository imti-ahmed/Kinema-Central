export function MVPUsersTable() {
  const mvpUsers = [
    { category: "Most Movies", user: "Imti" },
    { category: "Most TV Shows", user: "Shivraj" },
    { category: "Most Watchlist", user: "Imti" }
  ];

  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-px pt-0 px-0 w-[292px]">
      {/* Header */}
      <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              MVP Users
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="bg-[#ffeded] h-[31px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[104px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Category
              </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[95px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                User
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rows */}
      {mvpUsers.map((row, index) => (
        <div key={index} className="bg-[#ffffff] h-[31px] mb-[-1px] relative shrink-0 w-full">
          <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
          <div className="flex flex-row items-center relative size-full">
            <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
              <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[104px]">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {row.category}
                </div>
              </div>
              <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[95px]">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {row.user}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}