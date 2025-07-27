import { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { TMDB_CONFIG, buildAPIUrl } from '../config/tmdb';

interface EditRatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, watchedSeasons?: number) => void;
  onAddToWatchlist?: (watchedSeasons?: number) => void;
  item: {
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
  } | null;
}

export function EditRatingPopup({ isOpen, onClose, onSubmit, onAddToWatchlist, item }: EditRatingPopupProps) {
  const { colors } = useTheme();
  const [rating, setRating] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [watchedSeasons, setWatchedSeasons] = useState<number>(1);
  const [totalSeasons, setTotalSeasons] = useState<number>(1);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && item) {
      // Set initial rating from current rating (only if it's not WL and not from TMDB search)
      if (item.currentRating && item.currentRating !== 'WL' && item.currentRating !== '-') {
        const currentRating = parseFloat(item.currentRating) || 0;
        setRating(currentRating);
      } else {
        setRating(0);
      }
      setHoveredStar(0);
      
      // Set initial seasons for TV shows
      if (item.media_type === 'tv') {
        setWatchedSeasons(item.watchedSeasons || 1);
        setTotalSeasons(item.totalSeasons || 1);
        
        // If we don't have season data, fetch it
        if (!item.totalSeasons && item.tmdbId) {
          fetchTotalSeasons(item.tmdbId);
        }
      }
    }
  }, [isOpen, item]);

  const fetchTotalSeasons = async (tmdbId: number) => {
    setIsLoadingSeasons(true);
    try {
      const apiUrl = buildAPIUrl(`${TMDB_CONFIG.ENDPOINTS.TV_DETAILS}/${tmdbId}`);
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const data = await response.json();
        const seasons = data.number_of_seasons || 1;
        setTotalSeasons(seasons);
      } else {
        console.error('Failed to fetch season data:', response.status, response.statusText);
        // Don't use mock data, just keep default of 1
        setTotalSeasons(1);
      }
    } catch (error) {
      console.error('Error fetching season data:', error);
      // Don't use mock data, just keep default of 1
      setTotalSeasons(1);
    } finally {
      setIsLoadingSeasons(false);
    }
  };

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  const incrementSeasons = () => {
    if (watchedSeasons < totalSeasons) {
      setWatchedSeasons(prev => prev + 1);
    }
  };

  const decrementSeasons = () => {
    if (watchedSeasons > 1) {
      setWatchedSeasons(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (rating > 0) {
      if (item?.media_type === 'tv') {
        onSubmit(rating, watchedSeasons);
      } else {
        onSubmit(rating);
      }
      onClose();
    }
  };

  const handleAddToWatchlist = () => {
    if (onAddToWatchlist) {
      if (item?.media_type === 'tv') {
        onAddToWatchlist(watchedSeasons);
      } else {
        onAddToWatchlist();
      }
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && rating > 0) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !item) return null;

  const getPosterUrl = (posterPath: string | null) => {
    return posterPath 
      ? `https://image.tmdb.org/t/p/w92${posterPath}`
      : null;
  };

  // Determine if this is from TMDB search (no currentRating or currentRating is empty)
  const isFromSearch = !item.currentRating || item.currentRating === '' || item.currentRating === '-';
  // Determine if this is from watchlist (currentRating is 'WL')
  const isFromWatchlist = item.currentRating === 'WL' || item.isFromWatchlist;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: `${colors.primary}08` }}
      onClick={onClose}
    >
      <div 
        className="bg-white border border-solid p-6 shadow-lg max-w-md w-full mx-4"
        style={{ borderColor: colors.secondary }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-4 relative">
          <h3 
            className="font-['Archivo'] font-semibold text-[14px] text-center"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            {isFromSearch ? 'Rate & Add' : isFromWatchlist ? 'Rate from Watchlist' : 'Edit Rating'}
          </h3>
          <button 
            onClick={onClose}
            className="absolute right-0 text-[16px] hover:opacity-70"
            style={{ color: colors.secondary }}
          >
            ×
          </button>
        </div>

        {/* Movie/Show Info - Centered */}
        <div className="flex flex-col items-center mb-6">
          {/* Poster */}
          <div className="flex-shrink-0 w-16 h-24 overflow-hidden mb-3">
            {getPosterUrl(item.poster_path) ? (
              <img 
                src={getPosterUrl(item.poster_path)!}
                alt={`${item.title} poster`}
                className="w-full h-full object-cover"
                onError={(e) => {
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
                display: getPosterUrl(item.poster_path) ? 'none' : 'flex'
              }}
            >
              No Image
            </div>
          </div>
          
          {/* Info - Centered */}
          <div className="text-center">
            <h4 
              className="font-['Archivo'] font-semibold text-[12px] mb-1"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              {item.title}
            </h4>
            <p 
              className="font-['Archivo'] font-medium text-[10px] mb-2"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
            >
              {item.year} • {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
            </p>
            {!isFromSearch && (
              <p 
                className="font-['Archivo'] font-medium text-[10px] mb-2"
                style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
              >
                Current: {item.currentRating === 'WL' ? 'In Watchlist' : `${item.currentRating}/10`}
              </p>
            )}
          </div>
        </div>

        {/* Season Tracker for TV Shows */}
        {item.media_type === 'tv' && (
          <div className="mb-6">
            <p 
              className="font-['Archivo'] font-medium text-[12px] mb-3 text-center"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              Seasons Watched:
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Minus Button */}
              <button
                onClick={decrementSeasons}
                disabled={watchedSeasons <= 1}
                className="w-8 h-8 border border-solid flex items-center justify-center text-[16px] font-medium hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ 
                  borderColor: colors.secondary,
                  color: colors.primary,
                  backgroundColor: colors.background
                }}
              >
                −
              </button>

              {/* Season Display */}
              <div className="flex items-center gap-2">
                <span 
                  className="font-['Archivo'] font-semibold text-[14px]"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
                >
                  {isLoadingSeasons ? 'Loading...' : `${watchedSeasons}/${totalSeasons}`}
                </span>
              </div>

              {/* Plus Button */}
              <button
                onClick={incrementSeasons}
                disabled={watchedSeasons >= totalSeasons}
                className="w-8 h-8 border border-solid flex items-center justify-center text-[16px] font-medium hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ 
                  borderColor: colors.secondary,
                  color: colors.primary,
                  backgroundColor: colors.background
                }}
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Rating Section */}
        <div className="mb-6">
          <p 
            className="font-['Archivo'] font-medium text-[12px] mb-3 text-center"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            {isFromSearch ? 'Rate this (1-10 stars):' : 'Update your rating (1-10 stars):'}
          </p>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((starValue) => (
              <button
                key={starValue}
                onClick={() => handleStarClick(starValue)}
                onMouseEnter={() => handleStarHover(starValue)}
                onMouseLeave={() => setHoveredStar(0)}
                className="text-[20px] transition-colors duration-150 hover:scale-110 transform transition-transform"
                style={{
                  color: starValue <= (hoveredStar || rating) ? colors.primary : colors.secondary
                }}
              >
                ★
              </button>
            ))}
          </div>

          {/* Rating Display */}
          <div className="text-center">
            <p 
              className="font-['Archivo'] font-medium text-[12px]"
              style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
            >
              {rating > 0 ? `${isFromSearch ? 'Rating' : 'New Rating'}: ${rating}/10` : 'Click a star to rate'}
            </p>
          </div>
        </div>

        {/* Action Buttons - Centered */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-solid font-['Archivo'] font-medium text-[12px] hover:opacity-70 transition-opacity"
            style={{ 
              fontVariationSettings: "'wdth' 100", 
              borderColor: colors.secondary,
              color: colors.secondary 
            }}
          >
            Cancel
          </button>

          {/* Show Add to Watchlist button only when rating from TMDB search and not from watchlist */}
          {isFromSearch && !isFromWatchlist && onAddToWatchlist && (
            <button
              onClick={handleAddToWatchlist}
              className="px-4 py-2 border border-solid font-['Archivo'] font-medium text-[12px] hover:opacity-70 transition-opacity"
              style={{ 
                fontVariationSettings: "'wdth' 100",
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: colors.background
              }}
            >
              Add to Watchlist
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="px-4 py-2 font-['Archivo'] font-medium text-[12px] text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ 
              fontVariationSettings: "'wdth' 100",
              backgroundColor: colors.primary
            }}
          >
            {isFromSearch ? `Add & Rate (${rating > 0 ? rating : 0}/10)` : `Update Rating (${rating > 0 ? rating : 0}/10)`}
          </button>
        </div>

        {/* Instructions */}
        <p 
          className="font-['Archivo'] font-normal text-[10px] text-center mt-3"
          style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
        >
          Press Enter to {isFromSearch ? 'add & rate' : 'update'} • Press Escape to cancel
        </p>
      </div>
    </div>
  );
}