import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import svgPaths from "../imports/svg-csm5d843mk";

function PreviousIcon() {
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
            fill="#FFC0C0"
            opacity="0.2"
          />
          <path
            d={svgPaths.p3c053880}
            fill="#FFC0C0"
          />
        </g>
      </svg>
    </div>
  );
}

function NextIcon() {
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
            fill="#DF3B3B"
            opacity="0.2"
          />
          <path
            d={svgPaths.p3c053880}
            fill="#DF3B3B"
          />
        </g>
      </svg>
    </div>
  );
}

interface PersonalStatsEntry {
  id: string;
  username: string;
  watched_movies: number;
  watched_shows: number;
  watchlist_movies: number;
  watchlist_shows: number;
  total_entries: number;
}

export function PersonalStatsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<PersonalStatsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const entriesPerPage = 16;
  const totalPages = Math.ceil(users.length / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, users.length);

  useEffect(() => {
    loadPersonalStats();
  }, []);

  const loadPersonalStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personal_stats')
        .select('id, username, watched_movies, watched_shows, watchlist_movies, watchlist_shows')
        .order('username', { ascending: true });

      if (error) {
        console.error('Error loading personal stats:', error);
        return;
      }

      const transformedUsers: PersonalStatsEntry[] = (data || []).map(user => ({
        id: user.id,
        username: user.username,
        watched_movies: user.watched_movies,
        watched_shows: user.watched_shows,
        watchlist_movies: user.watchlist_movies,
        watchlist_shows: user.watchlist_shows,
        total_entries: user.watched_movies + user.watched_shows
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error in loadPersonalStats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (currentPage > 1) {
      pages.push(1);
    }
    
    if (currentPage > 4) {
      pages.push('...');
    }
    
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      if (i !== 1 || currentPage === 1) {
        pages.push(i);
      }
    }
    
    if (currentPage < totalPages - 3) {
      pages.push('...');
    }
    
    if (currentPage < totalPages) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="box-border content-stretch flex flex-col items-start justify-start pb-px pt-0 px-0 w-full">
      {/* Header */}
      <div className="h-[41.045px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-2.5 h-[41.045px] items-center justify-start px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Personal Stats
            </div>
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="bg-[#ffeded] h-[31px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
            {["User Name", "Total Entries", "Movies", "Shows", "Movie Watchlist", "Show Watchlist"].map((header, index) => {
              const widths = ['w-[80px]', 'w-[85px]', 'w-[55px]', 'w-[50px]', 'w-[105px]', 'w-[100px]'];
              return (
              <div key={index} className={`box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 ${widths[index]}`}>
                <div
                  className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  {header}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Rows */}
      {loading ? (
        <div className="bg-[#ffffff] h-[31px] mb-[-1px] relative shrink-0 w-full">
          <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
          <div className="flex flex-row items-center justify-center relative size-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Loading...
            </div>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#ffffff] h-[31px] mb-[-1px] relative shrink-0 w-full">
          <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
          <div className="flex flex-row items-center justify-center relative size-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              No users found
            </div>
          </div>
        </div>
      ) : (
        users.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage).map((user, index) => (
          <div key={user.id} className="bg-[#ffffff] h-[31px] mb-[-1px] relative shrink-0 w-full">
            <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
            <div className="flex flex-row items-center relative size-full">
              <div className="box-border content-stretch flex flex-row gap-[35px] h-[31px] items-center justify-start px-[19px] py-3 relative w-full">
                {[user.username, user.total_entries, user.watched_movies, user.watched_shows, user.watchlist_movies, user.watchlist_shows].map((value, valueIndex) => {
                  const widths = ['w-[80px]', 'w-[85px]', 'w-[55px]', 'w-[50px]', 'w-[105px]', 'w-[100px]'];
                  return (
                  <div key={valueIndex} className={`box-border content-stretch flex flex-row gap-[99px] items-center justify-start p-0 relative shrink-0 ${widths[valueIndex]}`}>
                    <div
                      className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[10px] text-left text-nowrap"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      {value}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination Footer */}
      <div className="h-[41px] mb-[-1px] relative shrink-0 w-full">
        <div className="absolute border border-[#ffc0c0] border-solid inset-0 pointer-events-none" />
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row h-[41px] items-center justify-between px-[19px] py-3 relative w-full">
            <div
              className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[#df3b3b] text-[12px] text-left text-nowrap"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <span className="text-[#ffc0c0]">Showing</span>
              <span>{` ${startEntry}-${endEntry}/${users.length}`}</span>
              <span className="text-[#ffc0c0]">{` Entries`}</span>
            </div>
            
            <div className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                <PreviousIcon />
              </button>
              
              <div
                className="font-['Archivo'] font-semibold leading-[0] relative shrink-0 text-[12px] text-left"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                <span className="text-[#ffc0c0]">Previous</span>
                {getVisiblePages().map((page, index) => (
                  <span key={index}>
                    {typeof page === 'number' ? (
                      <button
                        onClick={() => handlePageClick(page)}
                        className={`mx-1 cursor-pointer hover:text-[#df3b3b] ${
                          page === currentPage ? 'text-[#df3b3b]' : 'text-[#ffc0c0]'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span className="text-[#ffc0c0] mx-1">{page}</span>
                    )}
                  </span>
                ))}
                <span className="text-[#df3b3b] ml-2">Next</span>
              </div>
              
              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
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
    </div>
  );
}