import svgPaths from "../imports/svg-68s0e2ro1x";
import { useTheme } from "./ThemeContext";
import { TMDBSearch } from "./TMDBSearch";
import { SortOption } from "./PersonalSearchAndFilters";

function SecondaryTabIcon({ pathFill, pathOutline, isActive }: { pathFill: string; pathOutline: string; isActive: boolean }) {
  const { colors } = useTheme();
  const fillColor = isActive ? colors.primary : colors.secondary;
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
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
  const { colors } = useTheme();
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
            stroke={colors.primary}
          />
        </svg>
      </div>
    </div>
  );
}

interface SearchAndFiltersProps {
  activeTab: 'movies' | 'shows';
  onTabChange: (tab: 'movies' | 'shows') => void;
  activeSortOption?: SortOption;
  onSortOptionChange?: (option: SortOption) => void;
  onRatingRequest?: (item: {
    id: number;
    title: string;
    year: number;
    currentRating: string;
    poster_path?: string | null;
    media_type: 'movie' | 'tv';
    watchedSeasons?: number;
    totalSeasons?: number;
    tmdbId?: number;
    isFromWatchlist?: boolean;
  }) => void;
}

export function SearchAndFilters({ 
  activeTab, 
  onTabChange, 
  activeSortOption = 'rating',
  onSortOptionChange,
  onRatingRequest 
}: SearchAndFiltersProps) {
  const { colors } = useTheme();
  
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="absolute border-[#ffebeb] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      
      <div className="box-border content-stretch flex flex-row items-center justify-between pb-4 pt-3 w-full max-w-7xl mx-auto">
        {/* Search Bar */}
        <TMDBSearch 
          isMovies={activeTab === 'movies'} 
          onResultSelect={(result) => {
            console.log('Selected:', result);
            // You can add logic here to handle the selected result
            // For example, adding it to a watchlist or showing more details
          }}
          onRatingRequest={onRatingRequest}
        />

        {/* Secondary Navigation */}
        <div className="box-border content-stretch flex flex-row gap-[18px] items-center justify-start p-0 relative shrink-0">
          {/* Movies Tab */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onTabChange('movies')}
          >
            <SecondaryTabIcon pathFill={svgPaths.pab02980} pathOutline={svgPaths.p2c7d7370} isActive={activeTab === 'movies'} />
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ 
                fontVariationSettings: "'wdth' 100",
                color: activeTab === 'movies' ? colors.primary : colors.secondary
              }}
            >
              Movies
            </div>
          </button>

          {/* Shows Tab */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onTabChange('shows')}
          >
            <SecondaryTabIcon pathFill={svgPaths.p3373a900} pathOutline={svgPaths.p2902f760} isActive={activeTab === 'shows'} />
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ 
                fontVariationSettings: "'wdth' 100",
                color: activeTab === 'shows' ? colors.primary : colors.secondary
              }}
            >
              Shows
            </div>
          </button>

          <Divider />

          {/* Sort Alpha Tab */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onSortOptionChange?.('alpha')}
          >
            <SecondaryTabIcon pathFill={svgPaths.pf420480} pathOutline={svgPaths.p116a4580} isActive={activeSortOption === 'alpha'} />
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ 
                fontVariationSettings: "'wdth' 100", 
                color: activeSortOption === 'alpha' ? colors.primary : colors.secondary 
              }}
            >
              Sort Alpha
            </div>
          </button>

          {/* Sort Rating Tab */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onSortOptionChange?.('rating')}
          >
            <SecondaryTabIcon pathFill={svgPaths.p32e35cc0} pathOutline={svgPaths.pe65ed00} isActive={activeSortOption === 'rating'} />
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ 
                fontVariationSettings: "'wdth' 100", 
                color: activeSortOption === 'rating' ? colors.primary : colors.secondary 
              }}
            >
              Sort Rating
            </div>
          </button>

          {/* Sort Activity Tab */}
          <button 
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
            onClick={() => onSortOptionChange?.('activity')}
          >
            <SecondaryTabIcon pathFill={svgPaths.p66bf100} pathOutline={svgPaths.p21f44a80} isActive={activeSortOption === 'activity'} />
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ 
                fontVariationSettings: "'wdth' 100", 
                color: activeSortOption === 'activity' ? colors.primary : colors.secondary 
              }}
            >
              Sort Activity
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}