import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-x4b6pdq0y2";
import { MovieCard } from "./MovieCard";
import { useMovieData } from "./MovieDataContext";
import { useTheme } from './ThemeContext';
import { SortOption } from './PersonalSearchAndFilters';

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

function SmallTabIcon({ pathFill, pathOutline, isActive }: { pathFill: string; pathOutline: string; isActive: boolean }) {
  const { colors } = useTheme();
  const fillColor = isActive ? colors.primary : colors.secondary;
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

interface MoviesPersonalGridViewProps {
  activePersonalTab: 'watched' | 'watchlist' | 'recommends';
  onPersonalTabChange: (tab: 'watched' | 'watchlist' | 'recommends') => void;
  onViewChange: (view: 'grid' | 'list') => void;
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

function TableTitle({ activePersonalTab, onPersonalTabChange, onViewChange }: MoviesPersonalGridViewProps) {
  const { colors } = useTheme();
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
              {/* Grid View Tab - Active */}
              <button 
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
                onClick={() => onViewChange('grid')}
              >
                <SmallTabIcon pathFill={svgPaths.p1c061c00} pathOutline={svgPaths.p3cba2e80} isActive={true} />
                <div
                  className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
                >
                  Grid View
                </div>
              </button>

              {/* List View Tab */}
              <button 
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
                onClick={() => onViewChange('list')}
              >
                <SmallTabIcon pathFill="M5.5 6.5V12.5H2V6.5H5.5Z" pathOutline={svgPaths.p16e4a600} isActive={false} />
                <div
                  className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary, lineHeight: 'normal' }}
                >
                  List View
                </div>
              </button>
            </div>

            <Divider />

            {/* Watched and Watchlist */}
            <div className="box-border content-stretch flex flex-row gap-[18px] items-center justify-start p-0 relative shrink-0">
              {/* Watched Tab */}
              <button 
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
                onClick={() => onPersonalTabChange('watched')}
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
                onClick={() => onPersonalTabChange('watchlist')}
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

            {/* Recommends Tab */}
            <button 
              className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 cursor-pointer"
              onClick={() => onPersonalTabChange('recommends')}
            >
              <SmallTabIcon pathFill={svgPaths.p17d90900} pathOutline={svgPaths.p3806c700} isActive={activePersonalTab === 'recommends'} />
              <div
                className={`font-['Archivo'] font-semibold text-[12px] text-left text-nowrap`}
                style={{ 
                  fontVariationSettings: "'wdth' 100", 
                  color: activePersonalTab === 'recommends' ? colors.primary : colors.secondary,
                  lineHeight: 'normal'
                }}
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

function GridPagination({ totalEntries }: { totalEntries: number }) {
  const { colors } = useTheme();
  const totalPages = Math.ceil(totalEntries / 24);
  const showingEnd = Math.min(24, totalEntries);
  
  return (
    <div className="h-[41.045px] relative shrink-0 w-full">
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row h-[41.045px] items-center justify-between px-[19px] py-3 relative w-full">
          <div
            className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
          >
            <span style={{ color: colors.secondary }}>Showing</span>
            <span> 1-{showingEnd}/{totalEntries}</span>
            <span style={{ color: colors.secondary }}> Entries</span>
          </div>
          
          <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0">
            {/* Previous Arrow */}
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
                    fill={colors.secondary}
                    opacity="0.2"
                  />
                  <path
                    d={svgPaths.p3c053880}
                    fill={colors.secondary}
                  />
                </g>
              </svg>
            </div>
            
            <div className="flex items-center gap-0">
              <button
                className="font-['Archivo'] font-semibold text-[12px] hover:opacity-70 cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary, lineHeight: 'normal' }}
              >
                Previous
              </button>
              <button
                className="font-['Archivo'] font-semibold text-[12px] cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
              >
                1
              </button>
              {totalPages > 1 && (
                <>
                  <button
                    className="font-['Archivo'] font-semibold text-[12px] hover:opacity-70 cursor-pointer px-1"
                    style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary, lineHeight: 'normal' }}
                  >
                    2
                  </button>
                  {totalPages > 2 && (
                    <span
                      className="font-['Archivo'] font-semibold text-[12px] px-1"
                      style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary, lineHeight: 'normal' }}
                    >
                      ...
                    </span>
                  )}
                  <button
                    className="font-['Archivo'] font-semibold text-[12px] hover:opacity-70 cursor-pointer px-1"
                    style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary, lineHeight: 'normal' }}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                className="font-['Archivo'] font-semibold text-[12px] hover:opacity-70 cursor-pointer px-1"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
              >
                Next
              </button>
            </div>
            
            {/* Next Arrow */}
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
                        fill={colors.primary}
                        opacity="0.2"
                      />
                      <path
                        d={svgPaths.p3c053880}
                        fill={colors.primary}
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

// Sorting function for movies grid
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
        return b.year - a.year;
      });
    default:
      return data;
  }
}

export function MoviesPersonalGridView({ 
  activePersonalTab, 
  onPersonalTabChange, 
  onViewChange, 
  onEditRating,
  sortOption = 'rating'
}: MoviesPersonalGridViewProps) {
  const { watchedMovies, watchlistMovies } = useMovieData();
  const [sortedData, setSortedData] = useState<MovieEntry[]>([]);
  
  // Transform watched movies data
  const watchedMovieEntries: MovieEntry[] = watchedMovies
    .filter(movie => movie.media_type === 'movie')
    .map(movie => ({
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
    console.log('Applying sort to movies grid:', sortOption, 'to', currentData.length, 'items');
    const sorted = sortMovieData(currentData, sortOption);
    setSortedData(sorted);
  }, [currentData, sortOption, activePersonalTab]);
  
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="relative box-border content-stretch flex flex-col gap-[17px] items-start justify-start pb-[4px] pt-[24px] w-full max-w-7xl mx-auto">
        <TableTitle activePersonalTab={activePersonalTab} onPersonalTabChange={onPersonalTabChange} onViewChange={onViewChange} />
        
        {/* Grid Container with proper padding to match table */}
        <div className="w-full">
          {sortedData.length > 0 ? (
            /* Grid of Movies - 6 columns */
            <div className="grid grid-cols-6 gap-x-5 gap-y-5 w-full">
              {sortedData.slice(0, 24).map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  {...movie} 
                  onEditRating={onEditRating ? (item) => onEditRating({
                    ...item,
                    tmdbId: movie.tmdbId,
                    isFromWatchlist: movie.isFromWatchlist
                  }) : undefined}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12">
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
        </div>
        
        <GridPagination totalEntries={sortedData.length} />
      </div>
    </div>
  );
}