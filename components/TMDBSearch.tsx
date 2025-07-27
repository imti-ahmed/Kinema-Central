import { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { useMovieData } from './MovieDataContext';
import { TMDB_CONFIG, isAPIKeyConfigured, buildImageUrl, buildAPIUrl } from '../config/tmdb';

interface TMDBMovie {
  id: number;
  title: string;
  name?: string; // TV shows use 'name' instead of 'title'
  release_date: string;
  first_air_date?: string; // TV shows use 'first_air_date'
  overview: string;
  poster_path: string | null;
  vote_average: number;
  media_type?: 'movie' | 'tv';
  number_of_seasons?: number; // For TV shows
}

interface TMDBSearchProps {
  isMovies: boolean;
  onResultSelect?: (result: TMDBMovie) => void;
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

export function TMDBSearch({ isMovies, onResultSelect, onRatingRequest }: TMDBSearchProps) {
  const { colors } = useTheme();
  const { addMovieToWatched, addShowToWatched } = useMovieData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchTVDetails = async (tvId: number): Promise<number> => {
    try {
      const apiUrl = buildAPIUrl(`${TMDB_CONFIG.ENDPOINTS.TV_DETAILS}/${tvId}`);
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        return data.number_of_seasons || 1;
      }
    } catch (error) {
      console.error('Error fetching TV details:', error);
    }
    return 1; // Default fallback
  };

  const searchTMDB = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      setError('');
      return;
    }

    // Check if API key is configured
    if (!isAPIKeyConfigured()) {
      setError('Please configure your TMDB API key');
      setResults([]);
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const endpoint = isMovies ? TMDB_CONFIG.ENDPOINTS.SEARCH_MOVIE : TMDB_CONFIG.ENDPOINTS.SEARCH_TV;
      const apiUrl = buildAPIUrl(endpoint, {
        query: searchQuery,
        page: '1'
      });
      const response = await fetch(apiUrl);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your TMDB API key.');
        } else if (response.status === 404) {
          throw new Error('TMDB service not found.');
        } else {
          throw new Error(`API request failed: ${response.status}`);
        }
      }

      const data = await response.json();
      
      // Transform the results and fetch additional details for TV shows
      const transformedResults: TMDBMovie[] = await Promise.all(
        data.results.slice(0, 5).map(async (item: any) => {
          const result: TMDBMovie = {
            id: item.id,
            title: item.title || item.name, // Movies use 'title', TV shows use 'name'
            release_date: item.release_date || item.first_air_date || '',
            overview: item.overview || 'No overview available.',
            poster_path: item.poster_path,
            vote_average: item.vote_average || 0,
            media_type: isMovies ? 'movie' : 'tv'
          };

          // For TV shows, fetch the number of seasons
          if (!isMovies && item.id) {
            result.number_of_seasons = await fetchTVDetails(item.id);
          }

          return result;
        })
      );

      setResults(transformedResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('TMDB API Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search TMDB');
      setResults([]);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchTMDB(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, isMovies]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          const selected = results[selectedIndex];
          console.log('Enter pressed for:', selected);
          handleResultClick(selected);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleResultClick = (result: TMDBMovie) => {
    console.log('handleResultClick called with:', result);
    console.log('onRatingRequest exists:', !!onRatingRequest);
    console.log('isMovies:', isMovies);
    
    // Use the EditRatingPopup through the parent handler
    if (onRatingRequest) {
      const itemData = {
        id: result.id,
        title: result.title,
        year: formatYear(result.release_date),
        currentRating: '', // Empty rating indicates this is from search
        poster_path: result.poster_path,
        media_type: result.media_type || (isMovies ? 'movie' : 'tv'),
        watchedSeasons: 1,
        totalSeasons: result.number_of_seasons || 1,
        tmdbId: result.id,
        isFromWatchlist: false
      };
      
      console.log('Calling onRatingRequest with:', itemData);
      onRatingRequest(itemData);
    } else {
      console.log('onRatingRequest not available, using fallback');
      // Fallback to direct add (for backwards compatibility)
      const movieData = {
        tmdbId: result.id,
        title: result.title,
        year: formatYear(result.release_date),
        rating: 5, // Default rating
        media_type: result.media_type || (isMovies ? 'movie' : 'tv'),
        poster_path: result.poster_path,
        watchedSeasons: 1,
        ...(result.number_of_seasons && { totalSeasons: result.number_of_seasons })
      };

      if (result.media_type === 'tv' || !isMovies) {
        addShowToWatched(movieData);
      } else {
        addMovieToWatched(movieData);
      }
    }

    setIsOpen(false);
    setQuery('');
    setResults([]);
    onResultSelect?.(result);
  };

  const formatYear = (dateString: string): number => {
    return dateString ? new Date(dateString).getFullYear() : new Date().getFullYear();
  };

  const getPosterUrl = (posterPath: string | null) => {
    return buildImageUrl(posterPath, TMDB_CONFIG.IMAGE_SIZES.POSTER_SMALL);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="box-border content-stretch flex flex-row gap-2.5 h-[30px] items-center justify-start py-[11px] relative shrink-0 min-w-[400px] max-w-[500px] flex-grow">
        <div className="absolute border-solid inset-0 pointer-events-none" style={{ borderColor: colors.primary, borderWidth: '0px 0px 1px' }} />
        
        {/* Search Icon */}
        <div className="relative shrink-0 size-4">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 16 16"
          >
            <g>
              <path
                d="M10.5 10.5L14 14M12 6.5C12 9.26142 9.76142 11.5 7 11.5C4.23858 11.5 2 9.26142 2 6.5C2 3.73858 4.23858 1.5 7 1.5C9.76142 1.5 12 3.73858 12 6.5Z"
                fill={colors.primary}
                opacity="0.2"
              />
              <path
                d="M10.5 10.5L14 14M12 6.5C12 9.26142 9.76142 11.5 7 11.5C4.23858 11.5 2 9.26142 2 6.5C2 3.73858 4.23858 1.5 7 1.5C9.76142 1.5 12 3.73858 12 6.5Z"
                stroke={colors.primary}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Search for ${isMovies ? 'movies' : 'shows'}... (Press Enter to rate)`}
          className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left bg-transparent border-none outline-none w-full"
          style={{ 
            fontVariationSettings: "'wdth' 100",
            color: query ? colors.primary : colors.secondary
          }}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-3 w-3 border border-t-transparent rounded-full" style={{ borderColor: colors.secondary }}></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && !error && results.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 border border-solid shadow-lg z-50 max-h-80 overflow-y-auto bg-white"
          style={{ borderColor: colors.secondary }}
        >
          {results.map((result, index) => (
            <div
              key={result.id}
              className={`flex items-start gap-3 p-3 cursor-pointer border-b border-solid transition-colors ${
                index === selectedIndex ? 'opacity-70' : 'hover:opacity-80'
              }`}
              style={{ 
                borderColor: colors.secondary,
                backgroundColor: index === selectedIndex ? colors.tertiary : 'transparent'
              }}
              onClick={() => {
                console.log('Clicked on result:', result);
                handleResultClick(result);
              }}
            >
              {/* Poster Image */}
              <div className="flex-shrink-0 w-12 h-16 overflow-hidden">
                {getPosterUrl(result.poster_path) ? (
                  <img 
                    src={getPosterUrl(result.poster_path)!}
                    alt={`${result.title} poster`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center text-[10px] border border-solid"
                  style={{ 
                    backgroundColor: colors.tertiary, 
                    borderColor: colors.secondary, 
                    color: colors.secondary,
                    display: getPosterUrl(result.poster_path) ? 'none' : 'flex'
                  }}
                >
                  No Image
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 
                    className="font-['Archivo'] font-semibold text-[12px] text-left truncate"
                    style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                  >
                    {result.title}
                  </h4>
                  <span 
                    className="font-['Archivo'] font-medium text-[10px] flex-shrink-0"
                    style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
                  >
                    ({formatYear(result.release_date)})
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <span 
                      className="font-['Archivo'] font-medium text-[10px]"
                      style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                    >
                      ★ {result.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span 
                    className="font-['Archivo'] font-medium text-[10px] px-1 py-0.5 rounded text-[8px]"
                    style={{ 
                      fontVariationSettings: "'wdth' 100", 
                      backgroundColor: colors.secondary, 
                      color: 'white' 
                    }}
                  >
                    {result.media_type === 'movie' ? 'Movie' : `TV Show${result.number_of_seasons ? ` (${result.number_of_seasons} seasons)` : ''}`}
                  </span>
                </div>
                
                {/* Hint for Enter key */}
                {index === selectedIndex && (
                  <p 
                    className="font-['Archivo'] font-normal text-[9px] mt-1"
                    style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
                  >
                    Press Enter to rate and add to watched
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {isOpen && error && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 border border-solid shadow-lg z-50 bg-white p-4"
          style={{ borderColor: colors.secondary }}
        >
          <div className="text-center">
            <p 
              className="font-['Archivo'] font-medium text-[12px] mb-2"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              ⚠️ {error}
            </p>
            {error.includes('API key') && (
              <div className="text-left">
                <p 
                  className="font-['Archivo'] font-normal text-[10px] mb-1"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
                >
                  To use TMDB search:
                </p>
                <ol 
                  className="font-['Archivo'] font-normal text-[10px] list-decimal list-inside space-y-1"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
                >
                  <li>Visit <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener noreferrer" className="underline">themoviedb.org</a> and create an account</li>
                  <li>Go to Settings &gt; API and request an API key</li>
                  <li>Replace 'YOUR_API_KEY_HERE' in /config/tmdb.ts with your actual API key</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query && !isLoading && !error && results.length === 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 border border-solid shadow-lg z-50 bg-white p-4 text-center"
          style={{ borderColor: colors.secondary }}
        >
          <p 
            className="font-['Archivo'] font-medium text-[12px]"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
          >
            No {isMovies ? 'movies' : 'shows'} found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}