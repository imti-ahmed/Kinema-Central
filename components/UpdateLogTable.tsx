export function UpdateLogTable() {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-px pt-0 px-0 w-[360px]">
      {/* Header */}
      <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Update Log
            </div>
          </div>
        </div>
      </div>

      {/* Content Row */}
      <div className="bg-[#ffffff] h-[107px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="relative size-full">
          <div className="box-border content-stretch flex flex-col gap-4 h-[107px] items-start justify-start px-[19px] py-4 relative w-full">
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[110px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Date : 30/10/2025
              </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-full">
              <div
                className="font-['Archivo'] font-semibold leading-[15px] relative shrink-0 text-[#df3b3b] text-[10px] text-left whitespace-pre"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                <p className="block mb-0">
                  Added new search functionality, genres and even ability to sort all
                </p>
                <p className="block">
                  the lists based on your needs as per the requests
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}