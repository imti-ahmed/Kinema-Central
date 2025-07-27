import { useState, useEffect } from "react";
import { Pagination } from "./Pagination";
import { useTheme } from "./ThemeContext";
import { useMovieData } from "./MovieDataContext";
import { SortOption } from "./PersonalSearchAndFilters";
import { supabase } from "../lib/supabase";

interface MovieRatingFlat {
  movie_id: number;
  title: string;
  year: number;
  avg_rating: number;
  user_email: string;
  user_rating: number;
}

interface UserProfile {
  id: string;
  email: string;
  username: string;
}

interface MovieEntry {
  id: number;
  title: string;
  year: number;
  avgRating: string;
  tmdbId: number;
  poster_path: string | null;
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
              className="font-['Archivo'] font-semibold relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              No
            </div>
          </div>
          
          {/* Title Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[200px]">
            <div
              className="font-['Archivo'] font-semibold relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              Title
            </div>
          </div>
          
          {/* Year Column */}
          <div
            className="font-['Archivo'] font-semibold relative shrink-0 text-[12px] text-left w-[32.448px]"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            Year
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

function TableRow({ movie, index, onEditRating, userColumnNames, actualIndex }: { 
  movie: MovieEntry; 
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
    tmdbId?: number;
  }) => void;
}) {
  const { colors } = useTheme();
  
  // Add null check for userColumnNames
  const safeUserColumnNames = userColumnNames || [];
  
  const handleDoubleClick = () => {
    if (onEditRating) {
      onEditRating({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        currentRating: movie.avgRating,
        poster_path: movie.poster_path,
        media_type: 'movie',
        tmdbId: movie.tmdbId
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
              className="font-['Archivo'] font-semibold relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              {actualIndex + 1}
            </div>
          </div>
          
          {/* Title Column */}
          <div className="box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 w-[200px]">
            <div
              className="font-['Archivo'] font-semibold relative text-[12px] text-left overflow-hidden"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
              title={movie.title}
            >
              <span className="block truncate max-w-[180px]">{movie.title}</span>
            </div>
          </div>
          
          {/* Year Column */}
          <div
            className="font-['Archivo'] font-medium relative shrink-0 text-[12px] text-left w-[32.448px]"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            {movie.year}
          </div>
          
          {/* Average Rating Column */}
          <div className="box-border content-stretch flex flex-row font-['Archivo'] font-medium gap-[52px] items-center justify-start pl-5 pr-[20px] py-0 relative shrink-0 text-[12px] text-left" style={{ color: colors.primary }}>
            <div
              className="relative shrink-0 w-[80px]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              {movie.avgRating}
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
                title={`${safeUsername}: ${movie.userColumns[safeUsername] || '-'}`}
              >
                {movie.userColumns[safeUsername] || '-'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sorting function for global movies
function sortGlobalMovieData(data: MovieEntry[], sortOption: SortOption): MovieEntry[] {
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

export function DataTable({ 
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
    tmdbId?: number;
  }) => void;
  sortOption?: SortOption;
}) {
  const { colors } = useTheme();
  const [movies, setMovies] = useState<MovieEntry[]>([]);
  const [userColumnNames, setUserColumnNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedData, setSortedData] = useState<MovieEntry[]>([]);
  const itemsPerPage = 20;

  // Fetch movie ratings data
  useEffect(() => {
    fetchMovieRatings();
  }, []);

  const fetchMovieRatings = async () => {
    try {
      setLoading(true);

      // Step 1: Fetch movie_ratings_flat
      const { data: flatData, error: flatError } = await supabase
        .from('movie_ratings_flat')
        .select('*');

      if (flatError) {
        console.error('Error fetching movie_ratings_flat:', flatError);
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

      // Step 3: Group ratings by movie
      const groupedMovies: MovieEntry[] = [];
      
      if (flatData) {
        for (const row of flatData as MovieRatingFlat[]) {
          const username = emailToUsername[row.user_email];
          
          // Skip if no valid username found (no Anonymous or email entries)
          if (!username || username === 'Anonymous' || username.includes('@')) {
            continue;
          }
          
          let movie = groupedMovies.find(m => m.id === row.movie_id);
          
          if (!movie) {
            movie = {
              id: row.movie_id,
              title: row.title || 'Unknown Title',
              year: row.year || 0,
              avgRating: row.avg_rating ? row.avg_rating.toFixed(1) : '-',
              tmdbId: row.movie_id,
              poster_path: null,
              userColumns: {}
            };
            groupedMovies.push(movie);
          }

          if (username && username.trim()) {
            movie.userColumns[username] = row.user_rating ? row.user_rating.toFixed(1) : null;
          }
        }
      }

      // Step 4: Extract all unique usernames (only real usernames, no Anonymous/emails)
      const allUsernames = [...new Set(
        flatData?.map((row: MovieRatingFlat) => emailToUsername[row.user_email])
          .filter((username) => username && username !== 'Anonymous' && !username.includes('@')) || []
      )];

      // Filter out movies that have no valid user ratings
      const moviesWithValidRatings = groupedMovies.filter(movie => 
        Object.keys(movie.userColumns).length > 0
      );

      setMovies(moviesWithValidRatings);
      setUserColumnNames(allUsernames.sort());
    } catch (err) {
      console.error('Error fetching movie ratings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Apply sorting whenever data or sort option changes
  useEffect(() => {
    console.log('Applying sort to global movies:', sortOption, 'to', movies.length, 'items');
    const sorted = sortGlobalMovieData(movies, sortOption);
    setSortedData(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [movies, sortOption]);
  
  // Calculate pagination
  const totalItems = sortedData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageMovies = sortedData.slice(startIndex, endIndex);
  
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
              Loading movie ratings...
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
              className="font-['Archivo'] font-semibold relative shrink-0 text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              Global Movie Central ({(userColumnNames || []).length} users)
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <TableHeader userColumnNames={userColumnNames || []} />

      {/* Table Rows */}
      {currentPageMovies.length > 0 ? (
        currentPageMovies.map((movie, index) => (
          <TableRow 
            key={movie.id} 
            movie={movie} 
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
            No movies have been rated yet
          </div>
          <div
            className="font-['Archivo'] font-normal text-[12px] text-center max-w-md"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
          >
            Movies added to personal watchlists will appear here with all user ratings.
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