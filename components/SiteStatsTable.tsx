import { useTheme } from './ThemeContext';
import { useMovieData } from './MovieDataContext';

interface StatsRow {
  category: string;
  entries: number;
}

export function SiteStatsTable() {
  const { colors } = useTheme();
  const { globalMovies, globalShows, siteStats } = useMovieData();

  // Calculate statistics
  const totalMovies = globalMovies.length;
  const totalShows = globalShows.length;
  const totalEntries = totalMovies + totalShows;
  
  // Use real site statistics for watchlist counts
  const movieWatchlistCount = siteStats.totalMovieWatchlistEntries;
  const tvWatchlistCount = siteStats.totalShowWatchlistEntries;

  const statsRows: StatsRow[] = [
    { category: 'Total Entries', entries: totalEntries },
    { category: 'Movies', entries: totalMovies },
    { category: 'TV Shows', entries: totalShows },
    { category: 'Movie Watchlist', entries: movieWatchlistCount },
    { category: 'TV Watchlist', entries: tvWatchlistCount },
  ];

  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-px pt-0 px-0 w-[292px]">
      {/* Header */}
      <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              Stats of The Site
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="h-[31px] mb-[-1px] relative shrink-0 w-full" style={{ backgroundColor: colors.tertiary }}>
        <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[104px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
              >
                Category
              </div>
            </div>
            <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[95px]">
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[10px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
              >
                Entries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rows */}
      {statsRows.map((row, index) => (
        <div key={index} className="h-[31px] mb-[-1px] relative shrink-0 w-full" style={{ backgroundColor: colors.background }}>
          <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
          <div className="flex flex-row items-center relative size-full">
            <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
              <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[104px]">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                >
                  {row.category}
                </div>
              </div>
              <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[95px]">
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                >
                  {row.entries.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}