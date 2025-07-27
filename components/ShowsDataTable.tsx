import { useState, useEffect } from "react";
import { Pagination } from "./Pagination";
import { useTheme } from "./ThemeContext";
import { useMovieData } from "./MovieDataContext";
import { SortOption } from "./PersonalSearchAndFilters";
import { supabase } from "../lib/supabase";

interface ShowRatingFlat {
  show_id: number;
  title: string;
  year: number;
  avg_rating: number;
  user_email: string;
  user_rating: number;
  watched_seasons?: number;
  total_seasons?: number;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
}

interface ShowEntry {
  id: number;
  title: string;
  year: number;
  season: string; // Changed to string to support X/Y format
  avgRating: string;
  poster_path?: string | null;
  tmdbId?: number;
  watchedSeasons?: number;
  totalSeasons?: number;
  userColumns: { [username: string]: string | null };
}

function TableHeader({ userColumnNames }: { userColumnNames: string[] }) {
  const { colors } = useTheme();
  
  // Add null check for userColumnNames
  const safeUserColumnNames = userColumnNames || [];
  
  return (
    <div className="h-[40px] mb-[-1px] relative shrink-0 w-full" style={{ backgroundColor: colors.tertiary }}>
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[35px] h-[40px] items-center justify-start px-6 py-3 relative w-full">
          {/* No Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[25px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              No
            </div>
          </div>
          
          {/* Title Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[200px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              Title
            </div>
          </div>
          
          {/* Year Column */}
          <div
            className="font-['Archivo'] font-semibold text-[12px] text-left w-10"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            Year
          </div>
          
          {/* Season Column */}
          <div
            className="font-['Archivo'] font-semibold text-[12px] text-left w-16"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            Seasons
          </div>
          
          {/* Average Rating Column */}
          <div className="box-border content-stretch flex flex-row font-['Archivo'] font-semibold gap-[52px] items-center justify-start pl-5 pr-[20px] py-0 relative shrink-0 text-[12px] text-left" style={{ color: colors.primary }}>
            <div
              className="relative shrink-0 w-[80px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Avg Rating
            </div>
          </div>
          
          {/* User Rating Columns */}
          {safeUserColumnNames.map((username) => {
            const safeUsername = username || 'Anonymous';
            return (
              <div
                key={safeUsername}
                className="box-border content-stretch flex flex-row font-['Archivo'] font-semibold items-center justify-center p-0 relative shrink-0 text-[12px] text-center w-[60px]"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                title={safeUsername}
              >
                {safeUsername.length > 8 ? safeUsername.substring(0, 8) + '...' : safeUsername}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TableRow({ show, index, userColumnNames, onEditRating, actualIndex }: { 
  show: ShowEntry; 
  index: number;
  actualIndex: number;
  userColumnNames: string[];
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
  }) => void;
}) {
  const { colors } = useTheme();
  
  // Add null check for userColumnNames
  const safeUserColumnNames = userColumnNames || [];
  
  const handleDoubleClick = () => {
    if (onEditRating) {
      onEditRating({
        id: show.id,
        title: show.title,
        year: show.year,
        currentRating: show.avgRating,
        poster_path: show.poster_path,
        media_type: 'tv',
        watchedSeasons: show.watchedSeasons,
        totalSeasons: show.totalSeasons,
        tmdbId: show.tmdbId
      });
    }
  };
  
  return (
    <div className="h-[40px] mb-[-1px] relative shrink-0 w-full cursor-pointer hover:opacity-80" onDoubleClick={handleDoubleClick}>
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[35px] h-[40px] items-center justify-start px-6 py-3 relative w-full">
          {/* No Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[25px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              {actualIndex + 1}
            </div>
          </div>
          
          {/* Title Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[200px]">
            <div
              className="font-['Archivo'] font-semibold text-[12px] text-left overflow-hidden"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
              title={show.title}
            >
              <span className="block truncate max-w-[180px]">{show.title}</span>
            </div>
          </div>
          
          {/* Year Column */}
          <div
            className="font-['Archivo'] font-medium text-[12px] text-left w-10"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            {show.year}
          </div>
          
          {/* Season Column - Now shows X/Y format */}
          <div
            className="font-['Archivo'] font-medium text-[12px] text-left w-16"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            {show.season}
          </div>
          
          {/* Average Rating Column */}
          <div className="box-border content-stretch flex flex-row font-['Archivo'] font-medium gap-[52px] items-center justify-start pl-5 pr-[20px] py-0 relative shrink-0 text-[12px] text-left" style={{ color: colors.primary }}>
            <div
              className="relative shrink-0 w-[80px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {show.avgRating}
            </div>
          </div>
          
          {/* User Rating Columns */}
          {safeUserColumnNames.map((username) => {
            const safeUsername = username || 'Anonymous';
            return (
              <div
                key={safeUsername}
                className="box-border content-stretch flex flex-row font-['Archivo'] font-medium items-center justify-center p-0 relative shrink-0 text-[12px] text-center w-[60px]"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                title={`${safeUsername}: ${show.userColumns[safeUsername] || '-'}`}
              >
                {show.userColumns[safeUsername] || '-'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sorting function for global shows
function sortGlobalShowData(data: ShowEntry[], sortOption: SortOption): ShowEntry[] {
  switch (sortOption) {
    case 'alpha':
      return [...data].sort((a, b) => a.title.localeCompare(b.title));
    case 'rating':
      return [...data].sort((a, b) => {
        const aRating = a.avgRating === '-' ? 0 : parseFloat(a.avgRating) || 0;
        const bRating = b.avgRating === '-' ? 0 : parseFloat(b.avgRating) || 0;
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

export function ShowsDataTable({ 
  onEditRating,
  sortOption = 'rating'
}: { 
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
  }) => void;
  sortOption?: SortOption;
}) {
  const { colors } = useTheme();
  const [shows, setShows] = useState<ShowEntry[]>([]);
  const [userColumnNames, setUserColumnNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedData, setSortedData] = useState<ShowEntry[]>([]);
  const itemsPerPage = 20;

  // Fetch show ratings data
  useEffect(() => {
    fetchShowRatings();
  }, []);

  const fetchShowRatings = async () => {
    try {
      setLoading(true);

      // Step 1: Fetch show_ratings_flat
      const { data: flatData, error: flatError } = await supabase
        .from('show_ratings_flat')
        .select('*');

      if (flatError) {
        console.error('Error fetching show_ratings_flat:', flatError);
        setLoading(false);
        return;
      }

      // Step 2: Fetch user_profiles to get actual usernames
      const { data: userProfiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email, username');

      if (profileError) {
        console.warn('Could not fetch user_profiles, falling back to emails:', profileError);
      }

      // Create email to username mapping using real usernames
      const emailToUsername: Record<string, string> = {};
      if (userProfiles) {
        userProfiles.forEach((user: UserProfile) => {
          if (user.email && user.username) {
            // Only map if we have a real username (not Anonymous or email prefix)
            if (user.username !== 'Anonymous' && !user.username.includes('@')) {
              emailToUsername[user.email] = user.username;
            }
          }
        });
      }

      // Step 3: Group ratings by show
      const groupedShows: ShowEntry[] = [];
      
      if (flatData) {
        for (const row of flatData as ShowRatingFlat[]) {
          const username = emailToUsername[row.user_email];
          
          // Skip if no valid username found (no Anonymous or email entries)
          if (!username || username === 'Anonymous' || username.includes('@')) {
            continue;
          }
          
          let show = groupedShows.find(s => s.id === row.show_id);
          
          if (!show) {
            const watchedSeasons = row.watched_seasons || 1;
            const totalSeasons = row.total_seasons || 1;
            
            show = {
              id: row.show_id,
              title: row.title || 'Unknown Title',
              year: row.year || 0,
              season: `${watchedSeasons}/${totalSeasons}`, // X/Y format
              avgRating: row.avg_rating ? row.avg_rating.toFixed(1) : '-',
              tmdbId: row.show_id,
              poster_path: null,
              watchedSeasons: watchedSeasons,
              totalSeasons: totalSeasons,
              userColumns: {}
            };
            groupedShows.push(show);
          }

          if (username && username.trim()) {
            show.userColumns[username] = row.user_rating ? row.user_rating.toFixed(1) : null;
          }
        }
      }

      // Step 4: Extract all unique usernames (only real usernames, no Anonymous/emails)
      const allUsernames = [...new Set(
        flatData?.map((row: ShowRatingFlat) => emailToUsername[row.user_email])
          .filter((username) => username && username !== 'Anonymous' && !username.includes('@')) || []
      )];

      // Filter out shows that have no valid user ratings
      const showsWithValidRatings = groupedShows.filter(show => 
        Object.keys(show.userColumns).length > 0
      );

      setShows(showsWithValidRatings);
      setUserColumnNames(allUsernames.sort());
    } catch (err) {
      console.error('Error fetching show ratings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply sorting whenever data or sort option changes
  useEffect(() => {
    console.log('Applying sort to global shows:', sortOption, 'to', shows.length, 'items');
    const sorted = sortGlobalShowData(shows, sortOption);
    setSortedData(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [shows, sortOption]);
  
  // Calculate pagination
  const totalItems = sortedData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageShows = sortedData.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  if (loading) {
    return (
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="relative box-border content-stretch flex flex-col items-start justify-start pb-[4px] pt-[24px] w-full max-w-7xl mx-auto">
          <div className="h-[200px] flex flex-col items-center justify-center w-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <div
              className="font-['Archivo'] font-medium text-[14px]"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              Loading show ratings...
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="relative box-border content-stretch flex flex-col items-start justify-start pb-[4px] pt-[24px] w-full max-w-7xl mx-auto">
        {/* Table Title */}
        <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
          <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
          <div className="flex flex-row items-center relative size-full">
            <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-6 py-3 relative w-full">
              <div
                className="font-['Archivo'] font-semibold text-[12px] text-left text-nowrap"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
              >
                Global Show Central ({(userColumnNames || []).length} users)
              </div>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <TableHeader userColumnNames={userColumnNames || []} />

        {/* Table Rows */}
        {currentPageShows.length > 0 ? (
          currentPageShows.map((show, index) => (
            <TableRow 
              key={show.id} 
              show={show} 
              index={index}
              actualIndex={startIndex + index}
              userColumnNames={userColumnNames || []}
              onEditRating={onEditRating} 
            />
          ))
        ) : (
          /* Empty State */
          <div className="h-[200px] flex flex-col items-center justify-center w-full border border-solid" style={{ borderColor: colors.secondary }}>
            <div
              className="font-['Archivo'] font-medium text-[14px] mb-2"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              No shows have been rated yet
            </div>
            <div
              className="font-['Archivo'] font-normal text-[12px] text-center max-w-md"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
            >
              Shows added to personal watchlists will appear here with all user ratings.
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