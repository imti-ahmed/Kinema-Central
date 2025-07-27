import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, GlobalMovieView, GlobalShowView, UserMovieView, UserShowView, UserMovieWatchlistView, UserShowWatchlistView } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface MovieEntry {
  id: number;
  title: string;
  year: number;
  rating: string;
  tmdbId: number;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
}

interface ShowEntry {
  id: number;
  title: string;
  year: number;
  season: number;
  avgRating: string;
  userRatings: (string | number)[];
  tmdbId: number;
  poster_path: string | null;
  watchedSeasons: number;
  totalSeasons: number;
}

interface WatchlistMovieEntry {
  id: number;
  title: string;
  year: number;
  tmdbId: number;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
}

interface WatchlistShowEntry {
  id: number;
  title: string;
  year: number;
  tmdbId: number;
  poster_path: string | null;
  totalSeasons: number;
}

interface GlobalMovieEntry {
  id: number;
  title: string;
  year: number;
  avgRating: string;
  tmdbId: number;
  poster_path: string | null;
  userColumns: { [username: string]: string | null }; // Added user columns
}

interface GlobalShowEntry {
  id: number;
  title: string;
  year: number;
  season: number;
  avgRating: string;
  tmdbId: number;
  poster_path: string | null;
  watchedSeasons: number;
  totalSeasons: number;
  userColumns: { [username: string]: string | null }; // Added user columns
}

interface SiteStats {
  totalMovieWatchlistEntries: number;
  totalShowWatchlistEntries: number;
  totalUniqueMoviesInWatchlists: number;
  totalUniqueShowsInWatchlists: number;
}

interface MovieDataContextType {
  watchedMovies: MovieEntry[];
  watchedShows: ShowEntry[];
  watchlistMovies: WatchlistMovieEntry[];
  watchlistShows: WatchlistShowEntry[];
  globalMovies: GlobalMovieEntry[];
  globalShows: GlobalShowEntry[];
  userColumnNames: string[]; // Added to track user column names
  siteStats: SiteStats; // Added site-wide statistics
  addMovieToWatched: (movie: {
    tmdbId: number;
    title: string;
    year: number;
    rating: number;
    media_type: 'movie' | 'tv';
    poster_path: string | null;
  }) => void;
  addShowToWatched: (show: {
    tmdbId: number;
    title: string;
    year: number;
    rating: number;
    poster_path: string | null;
    watchedSeasons?: number;
    totalSeasons?: number;
  }) => void;
  addMovieToWatchlist: (movie: {
    tmdbId: number;
    title: string;
    year: number;
    media_type: 'movie' | 'tv';
    poster_path: string | null;
  }) => void;
  addShowToWatchlist: (show: {
    tmdbId: number;
    title: string;
    year: number;
    poster_path: string | null;
    totalSeasons?: number;
  }) => void;
  rateWatchlistMovie: (movieId: number, rating: number) => void;
  rateWatchlistShow: (showId: number, rating: number, watchedSeasons?: number) => void;
  updateMovieRating: (movieId: number, newRating: number) => void;
  updateShowRating: (showId: number, newRating: number, watchedSeasons?: number) => void;
  isInWatchlist: (tmdbId: number, mediaType: 'movie' | 'tv') => boolean;
  refreshGlobalData: () => Promise<void>; // Manual refresh function
  forceCompleteRefresh: () => Promise<void>; // Force complete refresh
  debugDatabaseOperations: () => Promise<void>; // Debug function

}

// Removed mock data - using real Supabase data only

const MovieDataContext = createContext<MovieDataContextType | undefined>(undefined);

export function MovieDataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, profile } = useAuth();
  const [watchedMovies, setWatchedMovies] = useState<MovieEntry[]>([]);
  const [watchedShows, setWatchedShows] = useState<ShowEntry[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<WatchlistMovieEntry[]>([]);
  const [watchlistShows, setWatchlistShows] = useState<WatchlistShowEntry[]>([]);
  const [globalMovies, setGlobalMovies] = useState<GlobalMovieEntry[]>([]);
  const [globalShows, setGlobalShows] = useState<GlobalShowEntry[]>([]);
  const [userColumnNames, setUserColumnNames] = useState<string[]>([]);
  const [siteStats, setSiteStats] = useState<SiteStats>({
    totalMovieWatchlistEntries: 0,
    totalShowWatchlistEntries: 0,
    totalUniqueMoviesInWatchlists: 0,
    totalUniqueShowsInWatchlists: 0
  });

  // Debug function to check database operations
  const debugDatabaseOperations = async () => {
    try {
      console.log('🔍 DEBUG: Starting database diagnostic...');
      
      // Check if tables exist by trying to query them directly
      const tableResults = [];
      const tablesToCheck = ['movies', 'shows', 'movies_global', 'shows_global', 'user_movie_ratings', 'user_show_ratings'];
      
      for (const tableName of tablesToCheck) {
        try {
          const { error } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
          if (!error) {
            tableResults.push(tableName);
          }
        } catch (e) {
          console.log(`❌ Table ${tableName} not accessible`);
        }
      }
      
      console.log('✅ DEBUG: Accessible tables:', tableResults);

      // Check data counts
      const { count: moviesCount } = await supabase.from('movies').select('*', { count: 'exact', head: true });
      const { count: showsCount } = await supabase.from('shows').select('*', { count: 'exact', head: true });
      const { count: movieRatingsCount } = await supabase.from('user_movie_ratings').select('*', { count: 'exact', head: true });
      const { count: showRatingsCount } = await supabase.from('user_show_ratings').select('*', { count: 'exact', head: true });

      console.log('📊 DEBUG: Data counts:', {
        movies: moviesCount,
        shows: showsCount,
        movieRatings: movieRatingsCount,
        showRatings: showRatingsCount
      });

      // Check global tables
      try {
        const { count: globalMoviesCount } = await supabase.from('movies_global').select('*', { count: 'exact', head: true });
        const { count: globalShowsCount } = await supabase.from('shows_global').select('*', { count: 'exact', head: true });
        console.log('🌐 DEBUG: Global table counts:', {
          moviesGlobal: globalMoviesCount,
          showsGlobal: globalShowsCount
        });
      } catch (globalError) {
        console.error('❌ DEBUG: Error checking global tables:', globalError);
      }

      console.log('✅ DEBUG: Database diagnostic completed');
    } catch (error) {
      console.error('❌ DEBUG: Database diagnostic failed:', error);
    }
  };

  const updatePersonalStats = async (userId: string) => {
    try {
      // Use the RPC function to update stats automatically
      const { error } = await supabase.rpc('update_user_personal_stats', {
        user_id_param: userId
      });

      if (error) {
        console.error('Error updating personal stats:', error);
      } else {
        console.log('Personal stats updated successfully for user:', userId);
      }
    } catch (error) {
      console.error('Error in updatePersonalStats:', error);
    }
  };

  const loadSiteStats = async () => {
    try {
      console.log('Loading site statistics...');
      
      // Get total movie watchlist entries
      const { count: movieWatchlistCount, error: movieWatchlistError } = await supabase
        .from('movie_watchlist')
        .select('*', { count: 'exact', head: true });

      // Get total show watchlist entries
      const { count: showWatchlistCount, error: showWatchlistError } = await supabase
        .from('show_watchlist')
        .select('*', { count: 'exact', head: true });

      // Get unique movies in watchlists
      const { data: uniqueMovies, error: uniqueMoviesError } = await supabase
        .from('movie_watchlist')
        .select('movie_id', { count: 'exact' });

      // Get unique shows in watchlists
      const { data: uniqueShows, error: uniqueShowsError } = await supabase
        .from('show_watchlist')
        .select('show_id', { count: 'exact' });

      if (movieWatchlistError || showWatchlistError || uniqueMoviesError || uniqueShowsError) {
        console.error('Error loading site stats:', {
          movieWatchlistError,
          showWatchlistError,
          uniqueMoviesError,
          uniqueShowsError
        });
        return;
      }

      // Calculate unique counts
      const uniqueMovieIds = new Set(uniqueMovies?.map(item => item.movie_id) || []);
      const uniqueShowIds = new Set(uniqueShows?.map(item => item.show_id) || []);

      const newSiteStats: SiteStats = {
        totalMovieWatchlistEntries: movieWatchlistCount || 0,
        totalShowWatchlistEntries: showWatchlistCount || 0,
        totalUniqueMoviesInWatchlists: uniqueMovieIds.size,
        totalUniqueShowsInWatchlists: uniqueShowIds.size
      };

      console.log('Site stats loaded:', newSiteStats);
      setSiteStats(newSiteStats);
    } catch (error) {
      console.error('Error in loadSiteStats:', error);
    }
  };

  // Load data when user changes or on initial load
  useEffect(() => {
    refreshData();
    // Run debug on initial load
    debugDatabaseOperations();
  }, [user, isAuthenticated]);

  const refreshData = async () => {
    try {
      console.log('Refreshing data - user:', user?.id, 'isAuthenticated:', isAuthenticated);
      
      await Promise.all([
        loadGlobalMovies(),
        loadGlobalShows(),
        loadSiteStats(), // Load site statistics
        ...(isAuthenticated ? [loadUserData()] : [])
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Manual refresh function for global data
  const refreshGlobalData = async () => {
    try {
      console.log('🔄 Manual refresh of global data...');
      await Promise.all([
        loadGlobalMovies(),
        loadGlobalShows(),
        loadSiteStats()
      ]);
      console.log('✅ Manual global data refresh completed');
    } catch (error) {
      console.error('❌ Error in manual global data refresh:', error);
    }
  };

  // Force complete refresh - most aggressive refresh
  const forceCompleteRefresh = async () => {
    try {
      console.log('🚀 FORCE COMPLETE REFRESH - all data...');
      
      // Run database debug first
      await debugDatabaseOperations();
      
      // Wait for database operations to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Try loading from global tables first, then fallback to base tables
      await Promise.all([
        loadGlobalMoviesFromGlobalTable(),
        loadGlobalShowsFromGlobalTable(),
        loadSiteStats(),
        ...(isAuthenticated ? [loadUserData()] : [])
      ]);
      
      console.log('✅ Force complete refresh completed');
    } catch (error) {
      console.error('❌ Error in force complete refresh:', error);
      // Fallback to base tables
      console.log('🔄 Falling back to base tables...');
      await Promise.all([
        loadGlobalMoviesFromBaseTables(),
        loadGlobalShowsFromBaseTables(),
        loadSiteStats(),
        ...(isAuthenticated ? [loadUserData()] : [])
      ]);
    }
  };

  // Get username mapping - handles missing profiles table
  const getUsernameMapping = async (): Promise<Map<string, string>> => {
    const userIdToUsername = new Map<string, string>();
    
    try {
      // Try to get user_profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, username');

      if (!profilesError && profiles && Array.isArray(profiles)) {
        profiles.forEach((profile: any) => {
          if (profile.id && profile.username) {
            userIdToUsername.set(profile.id, profile.username);
          }
        });
        console.log('👥 Loaded usernames from user_profiles table:', userIdToUsername.size, 'users');
        return userIdToUsername;
      }

      console.log('⚠️ user_profiles table not available, trying auth.users...');
      
      // Fallback: try to get user emails from auth.users as usernames
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (!authError && authUsers?.users) {
        authUsers.users.forEach((authUser: any) => {
          if (authUser.id && authUser.email) {
            // Use email prefix as username (before @)
            const username = authUser.email.split('@')[0];
            userIdToUsername.set(authUser.id, username);
          }
        });
        console.log('👥 Loaded usernames from auth.users:', userIdToUsername.size, 'users');
        return userIdToUsername;
      }

      console.log('⚠️ Could not load usernames from any source');
      
    } catch (error) {
      console.error('Error loading username mapping:', error);
    }

    // Return empty map as fallback
    return userIdToUsername;
  };

  // Try loading from global tables first
  const loadGlobalMoviesFromGlobalTable = async () => {
    try {
      console.log('🌐 Loading movies from movies_global table...');
      
      const { data: globalMovies, error: globalError } = await supabase
        .from('movies_global')
        .select('*')
        .order('created_at', { ascending: false });

      if (globalError) {
        console.error('❌ Error loading from movies_global:', globalError);
        throw globalError;
      }

      if (!globalMovies || globalMovies.length === 0) {
        console.log('⚠️ movies_global table is empty, falling back to base tables');
        await loadGlobalMoviesFromBaseTables();
        return;
      }

      // Extract user column names (exclude base columns)
      const baseColumns = ['id', 'tmdb_id', 'title', 'year', 'poster_path', 'avg_rating', 'rating_count', 'created_at', 'updated_at'];
      const allColumns = Object.keys(globalMovies[0]);
      const userColumns = allColumns.filter(col => !baseColumns.includes(col));
      
      console.log('👥 Found user columns in movies_global:', userColumns);
      setUserColumnNames(userColumns);

      const transformedMovies: GlobalMovieEntry[] = globalMovies.map((movie: any) => {
        // Extract user ratings into a separate object
        const userColumnData: { [username: string]: string | null } = {};
        userColumns.forEach(username => {
          const rating = movie[username];
          userColumnData[username] = rating !== null && rating !== undefined ? rating.toString() : '-';
        });

        return {
          id: movie.tmdb_id,
          title: movie.title,
          year: movie.year,
          avgRating: movie.avg_rating > 0 ? movie.avg_rating.toString() : '-',
          tmdbId: movie.tmdb_id,
          poster_path: movie.poster_path,
          userColumns: userColumnData
        };
      });

      console.log('✅ Movies loaded from movies_global:', transformedMovies.length, 'with', userColumns.length, 'user columns');
      setGlobalMovies(transformedMovies);
    } catch (error) {
      console.error('❌ Error loading movies from global table:', error);
      throw error;
    }
  };

  const loadGlobalShowsFromGlobalTable = async () => {
    try {
      console.log('🌐 Loading shows from shows_global table...');
      
      const { data: globalShows, error: globalError } = await supabase
        .from('shows_global')
        .select('*')
        .order('created_at', { ascending: false });

      if (globalError) {
        console.error('❌ Error loading from shows_global:', globalError);
        throw globalError;
      }

      if (!globalShows || globalShows.length === 0) {
        console.log('⚠️ shows_global table is empty, falling back to base tables');
        await loadGlobalShowsFromBaseTables();
        return;
      }

      // Extract user column names (exclude base columns)
      const baseColumns = ['id', 'tmdb_id', 'title', 'year', 'total_seasons', 'poster_path', 'avg_rating', 'rating_count', 'avg_watched_seasons', 'created_at', 'updated_at'];
      const allColumns = Object.keys(globalShows[0]);
      const userColumns = allColumns.filter(col => !baseColumns.includes(col));
      
      console.log('👥 Found user columns in shows_global:', userColumns);

      const transformedShows: GlobalShowEntry[] = globalShows.map((show: any) => {
        // Extract user ratings into a separate object
        const userColumnData: { [username: string]: string | null } = {};
        userColumns.forEach(username => {
          const rating = show[username];
          userColumnData[username] = rating !== null && rating !== undefined ? rating.toString() : '-';
        });

        return {
          id: show.tmdb_id,
          title: show.title,
          year: show.year,
          season: 1,
          avgRating: show.avg_rating > 0 ? show.avg_rating.toString() : '-',
          tmdbId: show.tmdb_id,
          poster_path: show.poster_path,
          watchedSeasons: Math.round(show.avg_watched_seasons) || 1,
          totalSeasons: show.total_seasons,
          userColumns: userColumnData
        };
      });

      console.log('✅ Shows loaded from shows_global:', transformedShows.length, 'with', userColumns.length, 'user columns');
      setGlobalShows(transformedShows);
    } catch (error) {
      console.error('❌ Error loading shows from global table:', error);
      throw error;
    }
  };

  // Fallback: load from base tables and build manually
  const loadGlobalMoviesFromBaseTables = async () => {
    try {
      console.log('🔧 Building movies from base tables...');
      
      // Step 1: Get all movies
      const { data: movies, error: moviesError } = await supabase
        .from('movies')
        .select('id, tmdb_id, title, year, poster_path, created_at')
        .order('created_at', { ascending: false });

      if (moviesError) {
        console.error('Error loading movies:', moviesError);
        return;
      }

      // Step 2: Get all movie ratings (no joins)
      const { data: movieRatings, error: ratingsError } = await supabase
        .from('user_movie_ratings')
        .select('movie_id, rating, user_id');

      if (ratingsError) {
        console.error('Error loading movie ratings:', ratingsError);
        // Continue without ratings if there's an error
      }

      // Step 3: Get username mapping (handles missing profiles table)
      const userIdToUsername = await getUsernameMapping();

      console.log('📊 Movies data loaded from base tables:', {
        movies: movies?.length || 0,
        movieRatings: movieRatings?.length || 0,
        userMappings: userIdToUsername.size
      });

      if (!movies || movies.length === 0) {
        console.log('No movies found in base tables');
        setGlobalMovies([]);
        setUserColumnNames([]);
        return;
      }

      // Step 4: Build global movies structure manually
      const userColumns = new Set<string>();
      const movieMap = new Map<number, any>();

      // Initialize movies in the map
      movies.forEach((movie: any) => {
        movieMap.set(movie.tmdb_id, {
          id: movie.tmdb_id,
          title: movie.title,
          year: movie.year,
          tmdbId: movie.tmdb_id,
          poster_path: movie.poster_path,
          movieInternalId: movie.id, // Store the internal ID for matching
          ratings: new Map(),
          ratingCount: 0,
          totalRating: 0
        });
      });

      console.log('🎬 Movie map initialized with', movieMap.size, 'movies');

      // Step 5: Process ratings if available
      if (movieRatings && Array.isArray(movieRatings)) {
        console.log('⭐ Processing', movieRatings.length, 'movie ratings...');
        
        movieRatings.forEach((rating: any) => {
          // Find the movie by internal ID
          const movie = movies.find(m => m.id === rating.movie_id);
          if (movie && rating.user_id) {
            const movieEntry = movieMap.get(movie.tmdb_id);
            const username = userIdToUsername.get(rating.user_id);
            
            if (movieEntry && username) {
              userColumns.add(username);
              movieEntry.ratings.set(username, rating.rating.toString());
              movieEntry.totalRating += rating.rating;
              movieEntry.ratingCount++;
            }
          }
        });
      }

      const userColumnNamesList = Array.from(userColumns);
      console.log('👥 Found user columns:', userColumnNamesList);
      
      setUserColumnNames(userColumnNamesList);

      const transformedMovies: GlobalMovieEntry[] = Array.from(movieMap.values()).map((movie) => {
        const userColumnData: { [username: string]: string | null } = {};
        userColumnNamesList.forEach(username => {
          userColumnData[username] = movie.ratings.get(username) || '-';
        });

        const avgRating = movie.ratingCount > 0 ? (movie.totalRating / movie.ratingCount).toFixed(1) : '-';

        return {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          avgRating: avgRating,
          tmdbId: movie.tmdbId,
          poster_path: movie.poster_path,
          userColumns: userColumnData
        };
      });

      console.log('✅ Movies built from base tables:', transformedMovies.length, 'movies with', userColumnNamesList.length, 'user columns');
      setGlobalMovies(transformedMovies);
      
    } catch (error) {
      console.error('Error building movies from base tables:', error);
    }
  };

  const loadGlobalShowsFromBaseTables = async () => {
    try {
      console.log('🔧 Building shows from base tables...');
      
      // Step 1: Get all shows
      const { data: shows, error: showsError } = await supabase
        .from('shows')
        .select('id, tmdb_id, title, year, total_seasons, poster_path, created_at')
        .order('created_at', { ascending: false });

      if (showsError) {
        console.error('Error loading shows:', showsError);
        return;
      }

      // Step 2: Get all show ratings (no joins)
      const { data: showRatings, error: ratingsError } = await supabase
        .from('user_show_ratings')
        .select('show_id, rating, watched_seasons, user_id');

      if (ratingsError) {
        console.error('Error loading show ratings:', ratingsError);
        // Continue without ratings if there's an error
      }

      // Step 3: Get username mapping (handles missing profiles table)
      const userIdToUsername = await getUsernameMapping();

      console.log('📊 Shows data loaded from base tables:', {
        shows: shows?.length || 0,
        showRatings: showRatings?.length || 0,
        userMappings: userIdToUsername.size
      });

      if (!shows || shows.length === 0) {
        console.log('No shows found in base tables');
        setGlobalShows([]);
        return;
      }

      // Step 4: Build global shows structure manually
      const userColumns = new Set<string>();
      const showMap = new Map<number, any>();

      // Initialize shows in the map
      shows.forEach((show: any) => {
        showMap.set(show.tmdb_id, {
          id: show.tmdb_id,
          title: show.title,
          year: show.year,
          tmdbId: show.tmdb_id,
          poster_path: show.poster_path,
          totalSeasons: show.total_seasons,
          showInternalId: show.id, // Store the internal ID for matching
          ratings: new Map(),
          ratingCount: 0,
          totalRating: 0,
          totalWatchedSeasons: 0
        });
      });

      console.log('📺 Show map initialized with', showMap.size, 'shows');

      // Step 5: Process ratings if available
      if (showRatings && Array.isArray(showRatings)) {
        console.log('⭐ Processing', showRatings.length, 'show ratings...');
        
        showRatings.forEach((rating: any) => {
          // Find the show by internal ID
          const show = shows.find(s => s.id === rating.show_id);
          if (show && rating.user_id) {
            const showEntry = showMap.get(show.tmdb_id);
            const username = userIdToUsername.get(rating.user_id);
            
            if (showEntry && username) {
              userColumns.add(username);
              showEntry.ratings.set(username, rating.rating.toString());
              showEntry.totalRating += rating.rating;
              showEntry.ratingCount++;
              showEntry.totalWatchedSeasons += rating.watched_seasons || 1;
            }
          }
        });
      }

      const userColumnNamesList = Array.from(userColumns);
      console.log('👥 Found user columns for shows:', userColumnNamesList);

      const transformedShows: GlobalShowEntry[] = Array.from(showMap.values()).map((show) => {
        const userColumnData: { [username: string]: string | null } = {};
        userColumnNamesList.forEach(username => {
          userColumnData[username] = show.ratings.get(username) || '-';
        });

        const avgRating = show.ratingCount > 0 ? (show.totalRating / show.ratingCount).toFixed(1) : '-';

        return {
          id: show.id,
          title: show.title,
          year: show.year,
          season: 1,
          avgRating: avgRating,
          tmdbId: show.tmdbId,
          poster_path: show.poster_path,
          watchedSeasons: show.ratingCount > 0 ? Math.round(show.totalWatchedSeasons / show.ratingCount) : 1,
          totalSeasons: show.totalSeasons,
          userColumns: userColumnData
        };
      });

      console.log('✅ Shows built from base tables:', transformedShows.length, 'shows with', userColumnNamesList.length, 'user columns');
      setGlobalShows(transformedShows);
      
    } catch (error) {
      console.error('Error building shows from base tables:', error);
    }
  };

  // Primary load functions that try global tables first
  const loadGlobalMovies = async () => {
    try {
      await loadGlobalMoviesFromGlobalTable();
    } catch (error) {
      console.log('🔄 Falling back to base tables for movies...');
      await loadGlobalMoviesFromBaseTables();
    }
  };

  const loadGlobalShows = async () => {
    try {
      await loadGlobalShowsFromGlobalTable();
    } catch (error) {
      console.log('🔄 Falling back to base tables for shows...');
      await loadGlobalShowsFromBaseTables();
    }
  };

  const loadUserData = async () => {
    if (!user) {
      console.log('No user found, clearing user data');
      setWatchedMovies([]);
      setWatchedShows([]);
      setWatchlistMovies([]);
      setWatchlistShows([]);
      return;
    }

    try {
      console.log('Loading user data for:', user.id);
      await Promise.all([
        loadUserMovies(),
        loadUserShows(),
        loadUserMovieWatchlist(),
        loadUserShowWatchlist()
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadUserMovies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_movies_view')
        .select('*')
        .eq('user_id', user.id)
        .order('rating_updated_at', { ascending: false });

      if (error) {
        console.error('Error loading user movies:', error);
        return;
      }

      const transformedMovies: MovieEntry[] = (data || []).map((movie: UserMovieView) => ({
        id: movie.tmdb_id,
        title: movie.title,
        year: movie.year,
        rating: movie.rating.toString(),
        tmdbId: movie.tmdb_id,
        media_type: 'movie' as const,
        poster_path: movie.poster_path
      }));

      setWatchedMovies(transformedMovies);
    } catch (error) {
      console.error('Error in loadUserMovies:', error);
      setWatchedMovies([]);
    }
  };

  const loadUserShows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_shows_view')
        .select('*')
        .eq('user_id', user.id)
        .order('rating_updated_at', { ascending: false });

      if (error) {
        console.error('Error loading user shows:', error);
        return;
      }

      const transformedShows: ShowEntry[] = (data || []).map((show: UserShowView) => ({
        id: show.tmdb_id,
        title: show.title,
        year: show.year,
        season: 1,
        avgRating: show.rating.toString(),
        userRatings: [show.rating, "-", "-", "-"],
        tmdbId: show.tmdb_id,
        poster_path: show.poster_path,
        watchedSeasons: show.watched_seasons,
        totalSeasons: show.total_seasons
      }));

      setWatchedShows(transformedShows);
    } catch (error) {
      console.error('Error in loadUserShows:', error);
      setWatchedShows([]);
    }
  };

  const loadUserMovieWatchlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_movie_watchlist_view')
        .select('*')
        .eq('user_id', user.id)
        .order('added_to_watchlist_at', { ascending: false });

      if (error) {
        console.error('Error loading user movie watchlist:', error);
        return;
      }

      const transformedWatchlist: WatchlistMovieEntry[] = (data || []).map((movie: UserMovieWatchlistView) => ({
        id: movie.tmdb_id,
        title: movie.title,
        year: movie.year,
        tmdbId: movie.tmdb_id,
        media_type: 'movie' as const,
        poster_path: movie.poster_path
      }));

      setWatchlistMovies(transformedWatchlist);
    } catch (error) {
      console.error('Error in loadUserMovieWatchlist:', error);
      setWatchlistMovies([]);
    }
  };

  const loadUserShowWatchlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_show_watchlist_view')
        .select('*')
        .eq('user_id', user.id)
        .order('added_to_watchlist_at', { ascending: false });

      if (error) {
        console.error('Error loading user show watchlist:', error);
        return;
      }

      const transformedWatchlist: WatchlistShowEntry[] = (data || []).map((show: UserShowWatchlistView) => ({
        id: show.tmdb_id,
        title: show.title,
        year: show.year,
        tmdbId: show.tmdb_id,
        poster_path: show.poster_path,
        totalSeasons: show.total_seasons
      }));

      setWatchlistShows(transformedWatchlist);
    } catch (error) {
      console.error('Error in loadUserShowWatchlist:', error);
      setWatchlistShows([]);
    }
  };

  const isInWatchlist = (tmdbId: number, mediaType: 'movie' | 'tv'): boolean => {
    if (mediaType === 'movie') {
      return watchlistMovies.some(movie => movie.tmdbId === tmdbId);
    } else {
      return watchlistShows.some(show => show.tmdbId === tmdbId);
    }
  };

  const findOrCreateMovie = async (tmdbId: number, title: string, year: number, poster_path: string | null) => {
    try {
      console.log('🎬 findOrCreateMovie called with:', { tmdbId, title, year });
      
      // First check if movie exists
      const { data: existingMovie } = await supabase
        .from('movies')
        .select('id')
        .eq('tmdb_id', tmdbId)
        .single();

      if (existingMovie) {
        console.log('✅ Movie exists with id:', existingMovie.id);
        return existingMovie.id;
      }

      console.log('🆕 Creating new movie...');
      // Create new movie
      const { data: newMovie, error } = await supabase
        .from('movies')
        .insert({
          tmdb_id: tmdbId,
          title,
          year,
          poster_path
        })
        .select('id')
        .single();

      if (error) {
        console.error('❌ Error creating new movie:', error);
        throw error;
      }

      console.log('✅ New movie created with id:', newMovie.id);
      return newMovie.id;
    } catch (error) {
      console.error('Error in findOrCreateMovie:', error);
      throw error;
    }
  };

  const findOrCreateShow = async (tmdbId: number, title: string, year: number, poster_path: string | null, totalSeasons?: number) => {
    try {
      console.log('🎬 findOrCreateShow called with:', { tmdbId, title, year, totalSeasons });
      
      // First check if show exists
      console.log('🔍 Checking if show exists in shows table...');
      const { data: existingShow, error: selectError } = await supabase
        .from('shows')
        .select('id, tmdb_id, title, year, total_seasons')
        .eq('tmdb_id', tmdbId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking for existing show:', selectError);
        throw selectError;
      }

      if (existingShow) {
        console.log('✅ Show exists:', existingShow);
        return existingShow.id;
      }

      console.log('🆕 Creating new show in shows table...');
      // Create new show
      const { data: newShow, error } = await supabase
        .from('shows')
        .insert({
          tmdb_id: tmdbId,
          title,
          year,
          total_seasons: totalSeasons || 1,
          poster_path
        })
        .select('id, tmdb_id, title, year, total_seasons')
        .single();

      if (error) {
        console.error('❌ Error creating new show:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ New show created successfully:', newShow);
      
      // Verify the show was created
      const { data: verifyShow, error: verifyError } = await supabase
        .from('shows')
        .select('*')
        .eq('id', newShow.id)
        .single();
        
      if (verifyError) {
        console.error('❌ Could not verify new show creation:', verifyError);
      } else {
        console.log('✅ Verified new show in database:', verifyShow);
      }
      
      return newShow.id;
    } catch (error) {
      console.error('❌ CRITICAL ERROR in findOrCreateShow:', error);
      throw error;
    }
  };

  const addMovieToWatchlist = (movie: {
    tmdbId: number;
    title: string;
    year: number;
    media_type: 'movie' | 'tv';
    poster_path: string | null;
  }) => {
    console.log('addMovieToWatchlist called with:', movie);
    
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    // Check if already in watchlist
    const existingWatchlistMovie = watchlistMovies.find(m => m.tmdbId === movie.tmdbId);
    if (existingWatchlistMovie) {
      console.log('Movie already in watchlist, skipping');
      return;
    }

    // Add to Supabase
    const addToDatabase = async () => {
      try {
        const movieId = await findOrCreateMovie(movie.tmdbId, movie.title, movie.year, movie.poster_path);

        // Add to watchlist
        const { error } = await supabase
          .from('movie_watchlist')
          .insert({
            user_id: user.id,
            movie_id: movieId
          });

        if (error && error.code !== '23505') { // Ignore duplicate key errors
          throw error;
        }

        console.log('✅ Movie added to watchlist, forcing refresh...');
        
        // Force immediate refresh after longer delay
        setTimeout(async () => {
          await forceCompleteRefresh();
        }, 3000);

      } catch (error) {
        console.error('Error adding movie to watchlist:', error);
      }
    };

    addToDatabase();
  };

  const addShowToWatchlist = (show: {
    tmdbId: number;
    title: string;
    year: number;
    poster_path: string | null;
    totalSeasons?: number;
  }) => {
    console.log('🎬 addShowToWatchlist called with:', show);
    
    if (!user) {
      console.log('❌ User not authenticated');
      return;
    }

    // Check if already in watchlist
    const existingWatchlistShow = watchlistShows.find(s => s.tmdbId === show.tmdbId);
    if (existingWatchlistShow) {
      console.log('Show already in watchlist, skipping');
      return;
    }

    // Add to Supabase
    const addToDatabase = async () => {
      try {
        console.log('🔄 Starting database operations for show watchlist...');
        const showId = await findOrCreateShow(show.tmdbId, show.title, show.year, show.poster_path, show.totalSeasons);

        // Add to watchlist
        const { error } = await supabase
          .from('show_watchlist')
          .insert({
            user_id: user.id,
            show_id: showId
          });

        if (error && error.code !== '23505') { // Ignore duplicate key errors
          console.error('❌ Error adding to show_watchlist:', error);
          throw error;
        }

        console.log('✅ Show added to watchlist, forcing refresh...');
        
        // Force immediate refresh after longer delay
        setTimeout(async () => {
          await forceCompleteRefresh();
        }, 3000);

      } catch (error) {
        console.error('❌ Error adding show to watchlist:', error);
      }
    };

    addToDatabase();
  };

  const rateWatchlistMovie = (movieId: number, rating: number) => {
    console.log('rateWatchlistMovie called with movieId:', movieId, 'rating:', rating);
    
    // Find the movie to rate BEFORE removing it from watchlist
    const movieToRate = watchlistMovies.find(movie => movie.id === movieId);
    console.log('rateWatchlistMovie: Found movie to rate:', movieToRate);
    
    if (movieToRate) {
      addMovieToWatched({
        tmdbId: movieToRate.tmdbId,
        title: movieToRate.title,
        year: movieToRate.year,
        rating,
        media_type: movieToRate.media_type,
        poster_path: movieToRate.poster_path
      });
    }
  };

  const rateWatchlistShow = (showId: number, rating: number, watchedSeasons?: number) => {
    console.log('rateWatchlistShow called with showId:', showId, 'rating:', rating);
    
    // Find the show to rate BEFORE removing it from watchlist
    const showToRate = watchlistShows.find(show => show.id === showId);
    console.log('rateWatchlistShow: Found show to rate:', showToRate);
    
    if (showToRate) {
      addShowToWatched({
        tmdbId: showToRate.tmdbId,
        title: showToRate.title,
        year: showToRate.year,
        rating,
        poster_path: showToRate.poster_path,
        watchedSeasons: watchedSeasons || 1,
        totalSeasons: showToRate.totalSeasons
      });
    }
  };

  const addMovieToWatched = (movie: {
    tmdbId: number;
    title: string;
    year: number;
    rating: number;
    media_type: 'movie' | 'tv';
    poster_path: string | null;
  }) => {
    console.log('🎬 addMovieToWatched called with:', movie);
    
    if (!user) {
      console.log('❌ User not authenticated');
      return;
    }

    // Add to Supabase
    const addToDatabase = async () => {
      try {
        console.log('🔄 Starting database operations for movie rating...');
        const movieId = await findOrCreateMovie(movie.tmdbId, movie.title, movie.year, movie.poster_path);

        // Upsert user rating - this should trigger the global table updates via database triggers
        console.log('🔄 Upserting user movie rating...');
        const { error } = await supabase
          .from('user_movie_ratings')
          .upsert({
            user_id: user.id,
            movie_id: movieId,
            rating: movie.rating
          });

        if (error) {
          console.error('❌ Error upserting movie rating:', error);
          throw error;
        }
        console.log('✅ Movie rating upserted successfully');

        // Remove from watchlist if it exists
        await supabase
          .from('movie_watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movieId);

        console.log('✅ Movie added to watched, forcing refresh...');
        
        // Force immediate refresh after longer delay to allow triggers to complete
        setTimeout(async () => {
          await forceCompleteRefresh();
        }, 3000);

      } catch (error) {
        console.error('❌ Error adding movie to watched:', error);
      }
    };

    addToDatabase();
  };

  const addShowToWatched = (show: {
    tmdbId: number;
    title: string;
    year: number;
    rating: number;
    poster_path: string | null;
    watchedSeasons?: number;
    totalSeasons?: number;
  }) => {
    console.log('🎬 addShowToWatched called with:', show);
    
    if (!user) {
      console.error('❌ User not authenticated - cannot add show to watched');
      return;
    }

    // Add to Supabase
    const addToDatabase = async () => {
      try {
        console.log('🔄 Starting database operations for show rating...');
        console.log('📊 User ID:', user.id);
        console.log('📺 Show details:', {
          tmdbId: show.tmdbId,
          title: show.title,
          year: show.year,
          rating: show.rating,
          watchedSeasons: show.watchedSeasons || 1,
          totalSeasons: show.totalSeasons
        });

        const showId = await findOrCreateShow(show.tmdbId, show.title, show.year, show.poster_path, show.totalSeasons);
        console.log('✅ Show ID obtained:', showId);

        // Upsert user rating - this should trigger the global table updates via database triggers
        console.log('🔄 Upserting user show rating to user_show_ratings table...');
        const { data: upsertData, error } = await supabase
          .from('user_show_ratings')
          .upsert({
            user_id: user.id,
            show_id: showId,
            rating: show.rating,
            watched_seasons: show.watchedSeasons || 1
          }, {
            onConflict: 'user_id,show_id'
          })
          .select();

        if (error) {
          console.error('❌ Error upserting show rating:', error);
          console.error('❌ Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }
        
        console.log('✅ Show rating upserted successfully:', upsertData);

        // Remove from watchlist if it exists
        console.log('🔄 Removing from watchlist...');
        const { error: deleteError } = await supabase
          .from('show_watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('show_id', showId);
          
        if (deleteError) {
          console.warn('⚠️ Error removing from watchlist (may not exist):', deleteError);
        } else {
          console.log('✅ Successfully removed from watchlist (or was not in watchlist)');
        }

        // Immediate check if the show appeared in global tables
        console.log('🔍 Checking if show appeared in shows_global...');
        const { data: globalCheck, error: globalError } = await supabase
          .from('shows_global')
          .select('*')
          .eq('tmdb_id', show.tmdbId)
          .single();
          
        if (globalError) {
          console.error('❌ Show NOT found in shows_global:', globalError);
        } else {
          console.log('✅ Show found in shows_global:', globalCheck);
        }

        console.log('✅ Show added to watched, forcing refresh in 5 seconds...');
        
        // Force immediate refresh after longer delay to allow triggers to complete
        setTimeout(async () => {
          console.log('🔄 Starting forced refresh after show addition...');
          await forceCompleteRefresh();
        }, 5000);

      } catch (error) {
        console.error('❌ CRITICAL ERROR adding show to watched:', error);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
      }
    };

    addToDatabase();
  };

  const updateMovieRating = (movieId: number, newRating: number) => {
    console.log('updateMovieRating called with:', movieId, newRating);
    
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    // Update in Supabase
    const updateInDatabase = async () => {
      try {
        // Find the movie record
        const { data: movieRecord } = await supabase
          .from('movies')
          .select('id')
          .eq('tmdb_id', movieId)
          .single();

        if (!movieRecord) {
          console.error('Movie not found for tmdbId:', movieId);
          return;
        }

        // Update user rating - this should trigger the global table updates via database triggers
        const { error } = await supabase
          .from('user_movie_ratings')
          .upsert({
            user_id: user.id,
            movie_id: movieRecord.id,
            rating: newRating
          });

        if (error) {
          throw error;
        }

        console.log('✅ Movie rating updated, forcing refresh...');
        
        // Force immediate refresh after longer delay to allow triggers to complete
        setTimeout(async () => {
          await forceCompleteRefresh();
        }, 3000);
      } catch (error) {
        console.error('Error updating movie rating:', error);
      }
    };

    updateInDatabase();
  };

  const updateShowRating = (showId: number, newRating: number, watchedSeasons?: number) => {
    console.log('updateShowRating called with:', showId, newRating, watchedSeasons);
    
    if (!user) {
      console.log('User not authenticated');
      return;
    }

    // Update in Supabase
    const updateInDatabase = async () => {
      try {
        // Find the show record
        const { data: showRecord } = await supabase
          .from('shows')
          .select('id')
          .eq('tmdb_id', showId)
          .single();

        if (!showRecord) {
          console.error('Show not found for tmdbId:', showId);
          return;
        }

        // Update user rating - this should trigger the global table updates via database triggers
        const { error } = await supabase
          .from('user_show_ratings')
          .upsert({
            user_id: user.id,
            show_id: showRecord.id,
            rating: newRating,
            watched_seasons: watchedSeasons || 1
          });

        if (error) {
          throw error;
        }

        console.log('✅ Show rating updated, forcing refresh...');
        
        // Force immediate refresh after longer delay to allow triggers to complete
        setTimeout(async () => {
          await forceCompleteRefresh();
        }, 3000);
      } catch (error) {
        console.error('Error updating show rating:', error);
      }
    };

    updateInDatabase();
  };

  return (
    <MovieDataContext.Provider value={{
      watchedMovies,
      watchedShows,
      watchlistMovies,
      watchlistShows,
      globalMovies,
      globalShows,
      userColumnNames,
      siteStats,
      addMovieToWatched,
      addShowToWatched,
      addMovieToWatchlist,
      addShowToWatchlist,
      rateWatchlistMovie,
      rateWatchlistShow,
      updateMovieRating,
      updateShowRating,
      isInWatchlist,
      refreshGlobalData,
      forceCompleteRefresh,
      debugDatabaseOperations
    }}>
      {children}
    </MovieDataContext.Provider>
  );
}

export function useMovieData() {
  const context = useContext(MovieDataContext);
  if (context === undefined) {
    throw new Error('useMovieData must be used within a MovieDataProvider');
  }
  return context;
}