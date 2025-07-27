import svgPaths from "../imports/svg-45i7oqczau";
import { useTheme } from './ThemeContext';

interface ShowCardProps {
  id: number;
  title: string;
  year: number;
  season: string;
  rating: string;
  poster_path: string | null;
  tmdbId: number;
  watchedSeasons: number;
  totalSeasons: number;
}

function StarIcon() {
  const { colors } = useTheme();
  
  return (
    <div className="relative shrink-0 size-3">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 8 8"
      >
        <g clipPath="url(#clip0_9_407)">
          <path
            d={svgPaths.peb47b80}
            fill={colors.primary}
            opacity="0.2"
          />
          <path
            d={svgPaths.p180ab780}
            fill={colors.primary}
          />
        </g>
        <defs>
          <clipPath id="clip0_9_407">
            <rect fill="white" height="8" width="8" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function RatingDisplay({ rating }: { rating: string }) {
  const { colors } = useTheme();
  
  return (
    <div className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0">
      <StarIcon />
      <div
        className="font-['Archivo'] font-normal text-[10px] text-left text-nowrap"
        style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
      >
        {rating}
      </div>
    </div>
  );
}

function SeasonAndRating({ season, rating }: { season: string; rating: string }) {
  const { colors } = useTheme();
  
  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      <div
        className="font-['Archivo'] font-normal text-[10px] text-left text-nowrap"
        style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
      >
        {season}
      </div>
      <RatingDisplay rating={rating} />
    </div>
  );
}

function CardContent({ title, year, season, rating }: { title: string; year: number; season: string; rating: string }) {
  const { colors } = useTheme();
  
  return (
    <div className="box-border content-stretch flex flex-col gap-1.5 items-start justify-start px-3 pb-3 pt-0 relative w-full">
      <div
        className="font-['Archivo'] font-semibold text-[8px] text-left w-full"
        style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
      >
        <p 
          className="block text-[10px] truncate"
          title={title}
        >
          {title}
        </p>
      </div>
      <div
        className="font-['Archivo'] font-normal text-[10px] text-left"
        style={{ fontVariationSettings: "'wdth' 100", color: colors.primary, lineHeight: 'normal' }}
      >
        {year}
      </div>
      <SeasonAndRating season={season} rating={rating} />
    </div>
  );
}

function ShowPoster({ poster_path, title }: { poster_path: string | null; title: string }) {
  const { colors } = useTheme();
  
  const getPosterUrl = (posterPath: string | null) => {
    return posterPath 
      ? `https://image.tmdb.org/t/p/w200${posterPath}`
      : null;
  };

  const posterUrl = getPosterUrl(poster_path);

  if (posterUrl) {
    return (
      <div className="h-[90px] relative shrink-0 w-full overflow-hidden">
        <img 
          src={posterUrl}
          alt={`${title} poster`}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling!.style.display = 'flex';
          }}
        />
        <div 
          className="w-full h-full flex items-center justify-center text-[8px] border border-solid absolute inset-0"
          style={{ 
            backgroundColor: colors.tertiary, 
            borderColor: colors.secondary, 
            color: colors.secondary,
            display: 'none'
          }}
        >
          No Image
        </div>
        <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      </div>
    );
  }

  // Fallback for when no poster is provided
  return (
    <div className="h-[90px] relative shrink-0 w-full flex items-center justify-center" style={{ backgroundColor: colors.tertiary }}>
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <span className="text-[8px]" style={{ color: colors.secondary }}>No Image</span>
    </div>
  );
}

export function ShowCard({ id, title, year, season, rating, poster_path, tmdbId, watchedSeasons, totalSeasons }: ShowCardProps) {
  const { colors } = useTheme();
  
  return (
    <div 
      className="bg-white box-border content-stretch flex flex-col items-start justify-start p-0 relative w-full h-[150px] cursor-pointer" 
      style={{ backgroundColor: colors.background }}
    >
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="box-border content-stretch flex flex-col gap-[7px] items-center justify-start p-0 relative shrink-0 w-full">
        <ShowPoster poster_path={poster_path} title={title} />
        <CardContent title={title} year={year} season={season} rating={rating} />
      </div>
    </div>
  );
}