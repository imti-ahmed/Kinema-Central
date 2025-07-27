import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-fpgq8e9l2r";
import { useMovieData } from "./MovieDataContext";
import { useTheme } from './ThemeContext';
import { Pagination } from './Pagination';
import { SortOption } from './PersonalSearchAndFilters';

function SmallTabIcon({ pathFill, pathOutline, isActive, disabled }: { pathFill: string; pathOutline: string; isActive: boolean; disabled?: boolean }) {
  const { colors } = useTheme();
  const fillColor = disabled ? colors.secondary + '40' : (isActive ? colors.primary : colors.secondary);
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

interface MoviesPersonalDataTableProps {
  activePersonalTab: 'watched' | 'watchlist' | 'recommends';
  onPersonalTabChange: (tab: 'watched' | 'watchlist' | 'recommends') => void;
  onViewChange?: (view: 'grid' | 'list') => void;
  sortOption?: SortOption;
  onEditRating?: (item: {
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

interface MovieEntry {
  id: number;
  title: string;
  year: number;
  rating: string;
  poster_path?: string | null;
  tmdbId?: number;
  media_type?: 'movie' | 'tv';
  isFromWatchlist?: boolean;
}

function TableTitle({ activePersonalTab, onPersonalTabChange, onViewChange }: MoviesPersonalDataTableProps) {
  const { colors } = useTheme();
  
  const handleTabChange = (tab: 'watched' | 'watchlist' | 'recommends') => {
    if (tab === 'recommends') return; // Prevent selection of disabled tab
    onPersonalTabChange(tab);
  };
  
  return (
    <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row h-[41.045px] items-center justify-between px-[19px] py-3 relative w-full">
          <div
            className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
          >
            Personal Showcase
          </div>
          
          <div className="box-border content-stretch flex flex-row gap-[18px] items-center justify-start p-0 relative shrink-0">
            {/* Grid View and List View */}
            <div className="box-border content-stretch flex flex-row gap-[18px] items-center justify-start p-0 relative shrink-0">
              {/* Grid View Tab */}
              <button 
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
                onClick={() => onViewChange?.('grid')}
              >
                <SmallTabIcon pathFill={svgPaths.p1c061c00} pathOutline={svgPaths.p3cba2e80} isActive={false} />
                <div
                  className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary, lineHeight: 'normal' }}
                >
                  Grid View
                </div>
              </button>

              {/* List View Tab - Active */}
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0">
                <SmallTabIcon pathFill="M5.5 6.5V12.5H2V6.5H5.5Z" pathOutline={svgPaths.p16e4a600} isActive={true} />
                <div
                  className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
                >
                  List View
                </div>
              </div>
            </div>

            <Divider />

            {/* Watched and Watchlist */}
            <div className="box-border content-stretch flex flex-row gap-[18px] items-center justify-start p-0 relative shrink-0">
              {/* Watched Tab */}
              <button 
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
                onClick={() => handleTabChange('watched')}
              >
                <SmallTabIcon pathFill={svgPaths.p30d87100} pathOutline={svgPaths.p3e9e4700} isActive={activePersonalTab === 'watched'} />
                <div
                  className={`font-['Archivo'] font-semibold text-[12px] text-left text-nowrap`}
                  style={{ 
                    fontVariationSettings: "'wdth' 100", 
                    color: activePersonalTab === 'watched' ? colors.primary : colors.secondary,
                    lineHeight: 'normal'
                  }}
                >
                  Watched
                </div>
              </button>

              {/* Watchlist Tab */}
              <button 
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
                onClick={() => handleTabChange('watchlist')}
              >
                <SmallTabIcon pathFill={svgPaths.p19c3aa00} pathOutline={svgPaths.p10d977c0} isActive={activePersonalTab === 'watchlist'} />
                <div
                  className={`font-['Archivo'] font-semibold text-[12px] text-left text-nowrap`}
                  style={{ 
                    fontVariationSettings: "'wdth' 100", 
                    color: activePersonalTab === 'watchlist' ? colors.primary : colors.secondary,
                    lineHeight: 'normal'
                  }}
                >
                  Watchlist
                </div>
              </button>
            </div>

            {/* Recommends Tab - Disabled */}
            <div 
              className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-not-allowed opacity-50"
              title="Coming Soon"
            >
              <SmallTabIcon pathFill={svgPaths.p17d90900} pathOutline={svgPaths.p3806c700} isActive={false} disabled={true} />
              <div
                className={`font-['Archivo'] font-semibold text-[12px] text-left text-nowrap`}
                style={{ 
                  fontVariationSettings: "'wdth' 100", 
                  color: colors.secondary + '60',
                  lineHeight: 'normal'
                }}
              >
                Recommends
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableHeader({ activePersonalTab }: { activePersonalTab: MoviesPersonalDataTableProps['activePersonalTab'] }) {
  const { colors } = useTheme();
  return (
    <div className="h-[40px] mb-[-1px] relative shrink-0 w-full" style={{ backgroundColor: colors.tertiary }}>
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[35px] h-[40px] items-center justify-start px-[19px] py-3 relative w-full">
          {/* No Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[25px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
            >
              No
            </div>
          </div>

          {/* Title Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[200px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
            >
              Title
            </div>
          </div>

          {/* Year Column */}
          <div
            className="font-['Archivo'] font-semibold text-[12px] text-left w-10"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
          >
            Year
          </div>

          {/* Rating Column */}
          <div className="box-border content-stretch flex flex-row gap-[52px] items-center justify-start pl-[15px] pr-[54px] py-0 relative shrink-0">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left w-[51px]"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
            >
              {activePersonalTab === 'watchlist' ? 'Status' : 'Rating'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableRow({ entry, actualIndex, onEditRating }: { 
  entry: MovieEntry; 
  actualIndex: number;
  onEditRating?: MoviesPersonalDataTableProps['onEditRating']; 
}) {
  const { colors } = useTheme();
  
  const handleDoubleClick = () => {
    if (onEditRating) {
      onEditRating({
        id: entry.id,
        title: entry.title,
        year: entry.year,
        currentRating: entry.rating,
        poster_path: entry.poster_path,
        media_type: entry.media_type || 'movie',
        tmdbId: entry.tmdbId,
        isFromWatchlist: entry.isFromWatchlist
      });
    }
  };

  return (
    <div 
      className="h-[40px] mb-[-1px] relative shrink-0 w-full cursor-pointer hover:opacity-80"
      onDoubleClick={handleDoubleClick}
      style={{ backgroundColor: colors.background }}
    >
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[35px] h-[40px] items-center justify-start px-[19px] py-3 relative w-full">
          {/* No */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[25px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
            >
              {actualIndex + 1}
            </div>
          </div>

          {/* Title */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[200px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left overflow-hidden"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
              title={entry.title}
            >
              <span className="block truncate max-w-[180px]">{entry.title}</span>
            </div>
          </div>

          {/* Year */}
          <div
            className="font-['Archivo'] font-medium text-[12px] text-left w-10"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
          >
            {entry.year}
          </div>

          {/* Rating */}
          <div className="box-border content-stretch flex flex-row gap-[52px] items-center justify-start pl-5 pr-[54px] py-0 relative shrink-0">
            <div
              className="font-['Archivo'] font-medium text-[12px] text-left w-[51px]"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
            >
              {entry.rating === 'WL' ? 'Watchlist' : entry.rating}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sorting function
function sortMovieData(data: MovieEntry[], sortOption: SortOption): MovieEntry[] {
  switch (sortOption) {
    case 'alpha':
      return [...data].sort((a, b) => a.title.localeCompare(b.title));
    case 'rating':
      return [...data].sort((a, b) => {
        const aRating = a.rating === 'Watchlist' ? 0 : parseFloat(a.rating) || 0;
        const bRating = b.rating === 'Watchlist' ? 0 : parseFloat(b.rating) || 0;
        return bRating - aRating; // Descending order
      });
    case 'activity':
      return [...data].sort((a, b) => {
        // For activity, we'll sort by year as a proxy for recent activity
        // In a real app, you'd have created_at or updated_at timestamps
        return b.year - a.year;
      });
    default:
      return data;
  }
}

export function MoviesPersonalDataTable({ 
  activePersonalTab, 
  onPersonalTabChange, 
  onViewChange, 
  onEditRating,
  sortOption = 'rating'
}: MoviesPersonalDataTableProps) {
  const { watchedMovies, watchlistMovies } = useMovieData();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedData, setSortedData] = useState<MovieEntry[]>([]);
  const itemsPerPage = 20;
  
  // Transform watched movies data
  const watchedMovieEntries: MovieEntry[] = watchedMovies
    .filter(movie => movie.media_type === 'movie')
    .map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      poster_path: movie.poster_path,
      tmdbId: movie.tmdbId,
      media_type: movie.media_type,
      isFromWatchlist: false
    }));

  // Transform watchlist movies data
  const watchlistMovieEntries: MovieEntry[] = watchlistMovies
    .filter(movie => movie.media_type === 'movie')
    .map(movie => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      rating: 'Watchlist',
      poster_path: movie.poster_path,
      tmdbId: movie.tmdbId,
      media_type: movie.media_type,
      isFromWatchlist: true
    }));
  
  const currentData = activePersonalTab === 'watched' ? watchedMovieEntries : watchlistMovieEntries;
  
  // Apply sorting whenever data or sort option changes
  useEffect(() => {
    console.log('Applying sort to movies:', sortOption, 'to', currentData.length, 'items');
    const sorted = sortMovieData(currentData, sortOption);
    setSortedData(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [currentData, sortOption, activePersonalTab]);

  // Calculate pagination
  const totalItems = sortedData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = sortedData.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when changing tabs
  const handleTabChange = (tab: 'watched' | 'watchlist' | 'recommends') => {
    if (tab === 'recommends') return; // Prevent selection of disabled tab
    setCurrentPage(1);
    onPersonalTabChange(tab);
  };
  
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="relative box-border content-stretch flex flex-col items-start justify-start pb-[4px] pt-[24px] w-full max-w-7xl mx-auto">
        <TableTitle 
          activePersonalTab={activePersonalTab} 
          onPersonalTabChange={handleTabChange} 
          onViewChange={onViewChange} 
        />
        <TableHeader activePersonalTab={activePersonalTab} />
        
        {currentPageData.length > 0 ? (
          currentPageData.map((entry, index) => (
            <TableRow 
              key={`${entry.id}-${entry.tmdbId}`} 
              entry={entry} 
              actualIndex={startIndex + index} 
              onEditRating={onEditRating} 
            />
          ))
        ) : (
          /* Empty State */
          <div className="h-[200px] flex flex-col items-center justify-center w-full border border-solid" style={{ borderColor: '#ffc0c0' }}>
            <div
              className="font-['Archivo'] font-medium text-[14px] mb-2"
              style={{ fontVariationSettings: "'wdth' 100", color: '#df3b3b' }}
            >
              No {activePersonalTab === 'watched' ? 'watched' : 'watchlist'} movies yet
            </div>
            <div
              className="font-['Archivo'] font-normal text-[12px] text-center max-w-md"
              style={{ fontVariationSettings: "'wdth' 100", color: '#ffc0c0' }}
            >
              {activePersonalTab === 'watched' 
                ? 'Search for movies and press Enter to rate and add them to your watched list.'
                : 'Movies will appear here when you add them to your watchlist.'
              }
            </div>
          </div>
        )}
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}