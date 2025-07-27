import svgPaths from "../imports/svg-1pscinn220";

function SearchIcon() {
  return (
    <div className="relative shrink-0 size-4">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g>
          <path
            d={svgPaths.p3276b8b0}
            fill="#DF3B3B"
            opacity="0.2"
          />
          <path
            d={svgPaths.p2714fd00}
            fill="#DF3B3B"
          />
        </g>
      </svg>
    </div>
  );
}

export function StatsSearchBar() {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="box-border content-stretch flex flex-row items-center justify-between pb-4 pt-3 px-6 w-full max-w-7xl mx-auto">
        <div className="absolute border-[#ffebeb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
        
        <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-[1227.92px]">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[30px] items-center justify-start px-0 py-[11px] relative shrink-0 w-[462px]">
            <div className="absolute border-[#df3b3b] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
            <SearchIcon />
            <div
              className="font-['Archivo:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffc0c0] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="block leading-[normal] whitespace-pre">
                Search for movies or shows...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}