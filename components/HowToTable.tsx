export function HowToTable() {
  const howToItems = [
    { 
      what: "Add New Record", 
      how: "Use Shift+N command or find your movie/show in the search bar and add it" 
    },
    { 
      what: "Rate The Records", 
      how: "Double click any movie/show in the watchlist to rate it and move it to watched list" 
    },
    { 
      what: "Recommend Record", 
      how: "Search any movie or double click existing record and add the user in the recommend dropdown option" 
    }
  ];

  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-px pt-0 px-0 w-[720px]">
      {/* Header */}
      <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              How To?
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="bg-[#ffeded] h-[31px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[140px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                What?
              </div>
            </div>
            <div className="basis-0 box-border content-stretch flex flex-row gap-[99px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                How?
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rows */}
      {howToItems.map((item, index) => (
        <div key={index} className="bg-[#ffffff] h-[31px] mb-[-1px] relative shrink-0 w-full">
          <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
          <div className="flex flex-row items-center relative size-full">
            <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
              <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[140px]">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {item.what}
                </div>
              </div>
              <div className="basis-0 box-border content-stretch flex flex-row gap-[99px] grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {item.how}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}