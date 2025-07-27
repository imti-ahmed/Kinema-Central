import svgPaths from "../imports/svg-68s0e2ro1x";
import { useTheme } from "./ThemeContext";

function PreviousIcon() {
  const { colors } = useTheme();
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
  );
}

function NextIcon() {
  const { colors } = useTheme();
  return (
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
  );
}

interface PaginationProps {
  currentPage?: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ 
  currentPage = 1, 
  totalItems, 
  itemsPerPage = 20, 
  onPageChange 
}: PaginationProps) {
  const { colors } = useTheme();
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };
  
  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  // Generate page numbers to display
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 4) {
        // Near the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
      <div className="absolute border border-solid inset-0 pointer-events-none" style={{ borderColor: colors.secondary }} />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row h-[41.045px] items-center justify-between px-6 py-3 relative w-full">
          {/* Entries Count */}
          <div
            className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'wdth' 100", color: colors.primary }}
          >
            <span style={{ color: colors.secondary }}>Showing</span>
            <span style={{ color: colors.primary }}> {startItem}-{endItem}/{totalItems}</span>
            <span style={{ color: colors.secondary }}> Entries</span>
          </div>

          {/* Pagination Controls */}
          <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0">
            <button onClick={handlePrevious} disabled={currentPage <= 1}>
              <PreviousIcon />
            </button>
            <div className="flex items-center gap-0">
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[12px] cursor-pointer px-1 transition-colors"
                style={{ 
                  fontVariationSettings: "'wdth' 100",
                  color: currentPage > 1 ? colors.secondary : colors.secondary,
                  opacity: currentPage <= 1 ? 0.5 : 1
                }}
                onClick={handlePrevious}
                disabled={currentPage <= 1}
                onMouseEnter={(e) => {
                  if (currentPage > 1) {
                    e.currentTarget.style.color = colors.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage > 1) {
                    e.currentTarget.style.color = colors.secondary;
                  }
                }}
              >
                Previous
              </button>
              
              {getVisiblePages().map((page, index) => 
                typeof page === 'number' ? (
                  <button
                    key={page}
                    className="font-['Archivo'] font-semibold leading-[0] text-[12px] cursor-pointer px-1 transition-colors"
                    style={{ 
                      fontVariationSettings: "'wdth' 100", 
                      color: page === currentPage ? colors.primary : colors.secondary 
                    }}
                    onClick={() => handlePageClick(page)}
                    onMouseEnter={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.color = colors.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== currentPage) {
                        e.currentTarget.style.color = colors.secondary;
                      }
                    }}
                  >
                    {page}
                  </button>
                ) : (
                  <span
                    key={`ellipsis-${index}`}
                    className="font-['Archivo'] font-semibold leading-[0] text-[12px] px-1"
                    style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
                  >
                    {page}
                  </span>
                )
              )}
              
              <button
                className="font-['Archivo'] font-semibold leading-[0] text-[12px] cursor-pointer px-1 transition-colors"
                style={{ 
                  fontVariationSettings: "'wdth' 100",
                  color: currentPage < totalPages ? colors.primary : colors.secondary,
                  opacity: currentPage >= totalPages ? 0.5 : 1
                }}
                onClick={handleNext}
                disabled={currentPage >= totalPages}
                onMouseEnter={(e) => {
                  if (currentPage < totalPages) {
                    e.currentTarget.style.color = colors.secondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage < totalPages) {
                    e.currentTarget.style.color = colors.primary;
                  }
                }}
              >
                Next
              </button>
            </div>
            <button onClick={handleNext} disabled={currentPage >= totalPages}>
              <div className="flex items-center justify-center relative shrink-0">
                <div className="flex-none rotate-[180deg] scale-y-[-100%]">
                  <NextIcon />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}