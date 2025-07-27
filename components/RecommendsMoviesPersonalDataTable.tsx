import svgPaths from "../imports/svg-2mxbvct4cn";

interface MovieRecommendEntry {
  id: number;
  title: string;
  year: number;
  addedBy: string;
  theirRating: number;
}

const movieRecommendsData: MovieRecommendEntry[] = [
  { id: 1, title: "The Cinematic Journey", year: 2023, addedBy: "Alex", theirRating: 8 },
  { id: 2, title: "Budget Adventures", year: 2022, addedBy: "Sam", theirRating: 6 },
  { id: 3, title: "Fortune's Path", year: 2021, addedBy: "Casey", theirRating: 9 },
  { id: 4, title: "Money Matters", year: 2020, addedBy: "Jordan", theirRating: 7 },
  { id: 5, title: "The Great Investment", year: 2023, addedBy: "Taylor", theirRating: 5 },
  { id: 6, title: "Wealth and Wisdom", year: 2022, addedBy: "Morgan", theirRating: 8 },
  { id: 7, title: "Financial Freedom", year: 2021, addedBy: "Avery", theirRating: 6 },
  { id: 8, title: "The Money Game", year: 2020, addedBy: "Riley", theirRating: 7 },
  { id: 9, title: "Investment Chronicles", year: 2023, addedBy: "Quinn", theirRating: 9 },
  { id: 10, title: "The Budget Diaries", year: 2022, addedBy: "Sage", theirRating: 4 },
  { id: 11, title: "Economic Tales", year: 2021, addedBy: "Drew", theirRating: 8 },
  { id: 12, title: "The Profit Margin", year: 2020, addedBy: "Emery", theirRating: 5 },
  { id: 13, title: "Capital Gains", year: 2023, addedBy: "Hayden", theirRating: 7 },
  { id: 14, title: "The Revenue Stream", year: 2022, addedBy: "Finley", theirRating: 6 },
  { id: 15, title: "Asset Management", year: 2021, addedBy: "Lennox", theirRating: 9 },
  { id: 16, title: "The Financial Frontier", year: 2020, addedBy: "Phoenix", theirRating: 8 },
];

function SmallTabIcon({ pathFill, pathOutline, isActive }: { pathFill: string; pathOutline: string; isActive: boolean }) {
  const fillColor = isActive ? "#DF3B3B" : "#FFC0C0";
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
            d={pathFill}
            fill={fillColor}
            opacity="0.2"
          />
          <path
            d={pathOutline}
            fill={fillColor}
          />
        </g>
      </svg>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-[10.277px] relative shrink-0 w-0">
      <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 2 11"
        >
          <path
            d="M1 0V10.2774"
            stroke="#DF3B3B"
          />
        </svg>
      </div>
    </div>
  );
}

interface RecommendsMoviesPersonalDataTableProps {
  activePersonalTab: 'watched' | 'watchlist' | 'recommends';
  onPersonalTabChange: (tab: 'watched' | 'watchlist' | 'recommends') => void;
}

function TableTitle({ activePersonalTab, onPersonalTabChange }: RecommendsMoviesPersonalDataTableProps) {
  return (
    <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
      <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row h-[41.045px] items-center justify-between px-[19px] py-3 relative w-full">
          <div
            className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Personal Showcase
          </div>
          
          {/* Personal Navigation */}
          <div className="box-border content-stretch flex flex-row gap-[18px] items-center justify-start p-0 relative shrink-0">
            {/* Grid View Tab */}
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0">
              <SmallTabIcon pathFill={svgPaths.p1c061c00} pathOutline={svgPaths.p3cba2e80} isActive={false} />
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#ffc0c0] text-[12px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Grid View
              </div>
            </div>

            {/* List View Tab - Active */}
            <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0">
              <SmallTabIcon pathFill="M5.5 6.5V12.5H2V6.5H5.5Z" pathOutline={svgPaths.p16e4a600} isActive={true} />
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                List View
              </div>
            </div>

            <Divider />

            {/* Watched Tab */}
            <button 
              className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
              onClick={() => onPersonalTabChange('watched')}
            >
              <SmallTabIcon pathFill={svgPaths.p30d87100} pathOutline={svgPaths.p3e9e4700} isActive={activePersonalTab === 'watched'} />
              <div
                className={`font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap ${
                  activePersonalTab === 'watched' ? 'text-[#df3b3b]' : 'text-[#ffc0c0]'
                }`}
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Watched
              </div>
            </button>

            {/* Watchlist Tab */}
            <button 
              className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
              onClick={() => onPersonalTabChange('watchlist')}
            >
              <SmallTabIcon pathFill={svgPaths.p19c3aa00} pathOutline={svgPaths.p10d977c0} isActive={activePersonalTab === 'watchlist'} />
              <div
                className={`font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap ${
                  activePersonalTab === 'watchlist' ? 'text-[#df3b3b]' : 'text-[#ffc0c0]'
                }`}
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Watchlist
              </div>
            </button>

            {/* Recommends Tab */}
            <button 
              className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
              onClick={() => onPersonalTabChange('recommends')}
            >
              <SmallTabIcon pathFill={svgPaths.p17d90900} pathOutline={svgPaths.p3806c700} isActive={activePersonalTab === 'recommends'} />
              <div
                className={`font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap ${
                  activePersonalTab === 'recommends' ? 'text-[#df3b3b]' : 'text-[#ffc0c0]'
                }`}
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Recommends
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="bg-[#ffeded] h-[40px] mb-[-1px] relative shrink-0 w-full">
      <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[35px] h-[40px] items-center justify-start px-[19px] py-3 relative w-full">
          {/* No Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[25px]">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              No
            </div>
          </div>
          
          {/* Title Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[150px]">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Title
            </div>
          </div>
          
          {/* Year Column */}
          <div
            className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left w-[46.71px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Year
          </div>
          
          {/* Added By Column */}
          <div className="box-border content-stretch flex flex-row gap-[52px] items-center justify-start pl-5 pr-[54px] py-0 relative shrink-0 w-[150px]">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left w-[80px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Added By
            </div>
          </div>
          
          {/* Their Rating Column */}
          <div className="box-border content-stretch flex flex-row gap-[52px] items-center justify-start pl-5 pr-[54px] py-0 relative shrink-0">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left w-[80px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Their Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ entry }: { entry: MovieRecommendEntry }) {
  return (
    <div className="h-[40px] mb-[-1px] relative shrink-0 w-full">
      <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[35px] h-[40px] items-center justify-start px-[19px] py-3 relative w-full">
          {/* No Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[25px]">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {entry.id}
            </div>
          </div>
          
          {/* Title Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[150px]">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {entry.title}
            </div>
          </div>
          
          {/* Year Column */}
          <div
            className="font-['Archivo'] font-medium leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left w-10"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {entry.year}
          </div>
          
          {/* Added By Column */}
          <div className="box-border content-stretch flex flex-row gap-[52px] items-center justify-start pl-5 pr-[54px] py-0 relative shrink-0 w-[150px]">
            <div
              className="font-['Archivo'] font-medium leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left w-[80px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {entry.addedBy}
            </div>
          </div>
          
          {/* Their Rating Column */}
          <div className="box-border content-stretch flex flex-row gap-[52px] items-center justify-start pl-5 pr-[54px] py-0 relative shrink-0">
            <div
              className="font-['Archivo'] font-medium leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left w-[80px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {entry.theirRating}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendsPagination() {
  return (
    <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
      <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row h-[41.045px] items-center justify-between px-[19px] py-3 relative w-full">
          <div
            className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <span className="text-[#ffc0c0]">Showing</span>
            <span> 1-16/300</span>
            <span className="text-[#ffc0c0]"> Entries</span>
          </div>
          
          {/* Pagination Controls */}
          <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0">
            <div className="relative shrink-0 size-4">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 16 16"
              >
                <g>
                  <path
                    d="M10 3V13L5 8L10 3Z"
                    fill="#FFC0C0"
                    opacity="0.2"
                  />
                  <path
                    d={svgPaths.p3c053880}
                    fill="#FFC0C0"
                  />
                </g>
              </svg>
            </div>
            <div className="flex items-center gap-0">
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[#ffc0c0] text-[12px] hover:text-[#df3b3b] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Previous
              </button>
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[#df3b3b] text-[12px] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                1
              </button>
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[#ffc0c0] text-[12px] hover:text-[#df3b3b] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                2
              </button>
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[#ffc0c0] text-[12px] hover:text-[#df3b3b] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                3
              </button>
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[#ffc0c0] text-[12px] hover:text-[#df3b3b] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                4
              </button>
              <span
                className="font-['Archivo'] font-semibold leading-[0] text-[#ffc0c0] text-[12px] px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                ...
              </span>
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[#ffc0c0] text-[12px] hover:text-[#df3b3b] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                16
              </button>
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[#df3b3b] text-[12px] hover:text-[#ffc0c0] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Next
              </button>
            </div>
            <div className="flex items-center justify-center relative shrink-0">
              <div className="flex-none rotate-[180deg] scale-y-[-100%]">
                <div className="relative size-4">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 16 16"
                  >
                    <g>
                      <path
                        d="M10 3V13L5 8L10 3Z"
                        fill="#DF3B3B"
                        opacity="0.2"
                      />
                      <path
                        d={svgPaths.p3c053880}
                        fill="#DF3B3B"
                      />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecommendsMoviesPersonalDataTable({ activePersonalTab, onPersonalTabChange }: RecommendsMoviesPersonalDataTableProps) {
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="relative box-border content-stretch flex flex-col items-start justify-start pb-[4px] pt-[24px] w-full max-w-7xl mx-auto">
        {/* Table Title */}
        <TableTitle activePersonalTab={activePersonalTab} onPersonalTabChange={onPersonalTabChange} />

        {/* Table Header */}
        <TableHeader />

        {/* Table Rows */}
        {movieRecommendsData.map((entry) => (
          <TableRow key={entry.id} entry={entry} />
        ))}

        {/* Pagination */}
        <RecommendsPagination />
      </div>
    </div>
  );
}