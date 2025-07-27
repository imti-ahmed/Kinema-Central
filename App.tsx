import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SearchAndFilters } from "./components/SearchAndFilters";
import { DataTable } from "./components/DataTable";
import { ShowsDataTable } from "./components/ShowsDataTable";
import { PersonalSearchAndFilters, SortOption } from "./components/PersonalSearchAndFilters";
import { PersonalDataTable } from "./components/PersonalDataTable";
import { MoviesPersonalDataTable } from "./components/MoviesPersonalDataTable";
import { MoviesPersonalGridView } from "./components/MoviesPersonalGridView";
import { ShowsPersonalGridView } from "./components/ShowsPersonalGridView";
import { RecommendsPersonalDataTable } from "./components/RecommendsPersonalDataTable";
import { RecommendsMoviesPersonalDataTable } from "./components/RecommendsMoviesPersonalDataTable";
import { Stats } from "./components/Stats";
import { Settings } from "./components/Settings";
import { AuthScreen } from "./components/AuthScreen";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { MovieDataProvider, useMovieData } from "./components/MovieDataContext";
import { EditRatingPopup } from "./components/EditRatingPopup";

type MainTab = 'global' | 'personal' | 'stats' | 'settings';
type SubTab = 'movies' | 'shows';
type PersonalTab = 'watched' | 'watchlist' | 'recommends';
type ViewMode = 'grid' | 'list';

interface EditItem {
  id: number;
  title: string;
  year: number;
  currentRating: string;
  poster_path?: string | null;
  media_type: 'movie' | 'tv';
  watchedSeasons?: number;
  totalSeasons?: number;
  tmdbId: number;
  isFromWatchlist?: boolean;
}

function AppContent() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('global');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('movies');
  const [activePersonalTab, setActivePersonalTab] = useState<PersonalTab>('watched');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeSortOption, setActiveSortOption] = useState<SortOption>('rating');
  const [globalSortOption, setGlobalSortOption] = useState<SortOption>('rating');
  const [editItem, setEditItem] = useState<EditItem | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const { colors } = useTheme();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { 
    updateMovieRating, 
    updateShowRating, 
    addMovieToWatchlist, 
    addShowToWatchlist,
    rateWatchlistMovie,
    rateWatchlistShow,
    addMovieToWatched,
    addShowToWatched,
    watchedMovies,
    watchedShows,
    watchlistMovies,
    watchlistShows,
    refreshGlobalData,
    forceCompleteRefresh
  } = useMovieData();

  const handleEditRating = (item: EditItem) => {
    console.log('🎬 handleEditRating called with:', item);
    setEditItem(item);
    setIsEditPopupOpen(true);
  };

  const handleEditSubmit = (newRating: number, watchedSeasons?: number) => {
    console.log('🎯 handleEditSubmit called with rating:', newRating, 'watchedSeasons:', watchedSeasons);
    
    if (editItem) {
      if (!editItem.currentRating || editItem.currentRating === '') {
        console.log('🔍 From TMDB search - adding to watched');
        if (editItem.media_type === 'movie') {
          addMovieToWatched({
            tmdbId: editItem.tmdbId,
            title: editItem.title,
            year: editItem.year,
            rating: newRating,
            media_type: editItem.media_type,
            poster_path: editItem.poster_path
          });
        } else {
          console.log('📺 Adding new show to watched from TMDB search');
          addShowToWatched({
            tmdbId: editItem.tmdbId,
            title: editItem.title,
            year: editItem.year,
            rating: newRating,
            poster_path: editItem.poster_path,
            watchedSeasons: watchedSeasons || 1,
            totalSeasons: editItem.totalSeasons || 1
          });
        }
      } else {
        console.log('🔄 Checking personal space for existing items');
        
        if (editItem.media_type === 'movie') {
          const existingWatchedMovie = watchedMovies.find(movie => movie.tmdbId === editItem.tmdbId);
          const existingWatchlistMovie = watchlistMovies.find(movie => movie.tmdbId === editItem.tmdbId);
          
          if (existingWatchedMovie) {
            console.log('🎬 Movie exists in watched - updating rating');
            updateMovieRating(existingWatchedMovie.id, newRating);
          } else if (existingWatchlistMovie) {
            console.log('📝 Movie exists in watchlist - rating and moving to watched');
            rateWatchlistMovie(existingWatchlistMovie.id, newRating);
          } else {
            console.log('➕ Movie not in personal space - adding to watched');
            addMovieToWatched({
              tmdbId: editItem.tmdbId,
              title: editItem.title,
              year: editItem.year,
              rating: newRating,
              media_type: editItem.media_type,
              poster_path: editItem.poster_path
            });
          }
        } else {
          const existingWatchedShow = watchedShows.find(show => show.tmdbId === editItem.tmdbId);
          const existingWatchlistShow = watchlistShows.find(show => show.tmdbId === editItem.tmdbId);
          
          if (existingWatchedShow) {
            console.log('📺 Show exists in watched - updating rating');
            updateShowRating(existingWatchedShow.id, newRating, watchedSeasons);
          } else if (existingWatchlistShow) {
            console.log('📝 Show exists in watchlist - rating and moving to watched');
            rateWatchlistShow(existingWatchlistShow.id, newRating, watchedSeasons);
          } else {
            console.log('➕ Show not in personal space - adding to watched');
            addShowToWatched({
              tmdbId: editItem.tmdbId,
              title: editItem.title,
              year: editItem.year,
              rating: newRating,
              poster_path: editItem.poster_path,
              watchedSeasons: watchedSeasons || 1,
              totalSeasons: editItem.totalSeasons || 1
            });
          }
        }
      }
    }
  };

  const handleAddToWatchlist = (watchedSeasons?: number) => {
    console.log('📋 handleAddToWatchlist called');
    if (editItem && editItem.tmdbId) {
      if (editItem.media_type === 'movie') {
        addMovieToWatchlist({
          tmdbId: editItem.tmdbId,
          title: editItem.title,
          year: editItem.year,
          media_type: editItem.media_type,
          poster_path: editItem.poster_path
        });
      } else {
        console.log('📺 Adding show to watchlist:', editItem.title);
        addShowToWatchlist({
          tmdbId: editItem.tmdbId,
          title: editItem.title,
          year: editItem.year,
          poster_path: editItem.poster_path,
          totalSeasons: editItem.totalSeasons
        });
      }
    }
  };

  const closeEditPopup = () => {
    console.log('❌ closeEditPopup called');
    setIsEditPopupOpen(false);
    setEditItem(null);
  };

  const handlePersonalTabChange = (tab: PersonalTab) => {
    if (tab === 'recommends') {
      return;
    }
    setActivePersonalTab(tab);
  };

  const handleSubTabChange = (tab: SubTab) => {
    setActiveSubTab(tab);
    if (activeMainTab === 'personal') {
      setActiveSortOption('rating');
    } else if (activeMainTab === 'global') {
      setGlobalSortOption('rating');
    }
  };

  const handleMainTabChange = (tab: MainTab) => {
    setActiveMainTab(tab);
    if (tab === 'global') {
      setGlobalSortOption('rating');
      console.log('🔄 Switching to global tab - manual refresh...');
      setTimeout(() => {
        refreshGlobalData();
      }, 500);
    } else if (tab === 'personal') {
      setActiveSortOption('rating');
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen"
        style={{ 
          fontFamily: 'Archivo, sans-serif',
          backgroundColor: colors.background
        }}
      >
        <AuthScreen />
      </div>
    );
  }

  const renderContent = () => {
    if (activeMainTab === 'personal') {
      return (
        <>
          <PersonalSearchAndFilters 
            activePersonalTab={activePersonalTab} 
            onPersonalTabChange={handlePersonalTabChange}
            activeSubTab={activeSubTab}
            onSubTabChange={handleSubTabChange}
            activeSortOption={activeSortOption}
            onSortOptionChange={setActiveSortOption}
          />  
          {activePersonalTab === 'recommends' ? (
            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
              <div className="w-full max-w-7xl mx-auto pb-[14px] min-h-[400px] flex items-center justify-center">
                <div
                  className="text-[16px] font-medium text-center opacity-60"
                  style={{ fontVariationSettings: "'wdth' 100", color: colors.secondary }}
                >
                  Recommends feature is coming soon!
                </div>
              </div>
            </div>
          ) : (
            activeSubTab === 'movies' ? (
              viewMode === 'grid' ? (
                <MoviesPersonalGridView
                  activePersonalTab={activePersonalTab}
                  onPersonalTabChange={handlePersonalTabChange}
                  onViewChange={setViewMode}
                  onEditRating={handleEditRating}
                  sortOption={activeSortOption}
                />
              ) : (
                <MoviesPersonalDataTable 
                  activePersonalTab={activePersonalTab} 
                  onPersonalTabChange={handlePersonalTabChange}
                  onViewChange={setViewMode}
                  onEditRating={handleEditRating}
                  sortOption={activeSortOption}
                />
              )
            ) : (
              viewMode === 'grid' ? (
                <ShowsPersonalGridView
                  activePersonalTab={activePersonalTab}
                  onPersonalTabChange={handlePersonalTabChange}
                  onViewChange={setViewMode}
                  onEditRating={handleEditRating}
                  sortOption={activeSortOption}
                />
              ) : (
                <PersonalDataTable 
                  activePersonalTab={activePersonalTab} 
                  onPersonalTabChange={handlePersonalTabChange}
                  onViewChange={setViewMode}
                  onEditRating={handleEditRating}
                  sortOption={activeSortOption}
                />
              )
            )
          )}
        </>
      );
    }
    
    if (activeMainTab === 'global') {
      return (
        <>
          <SearchAndFilters 
            activeTab={activeSubTab} 
            onTabChange={handleSubTabChange}
            activeSortOption={globalSortOption}
            onSortOptionChange={setGlobalSortOption}
            onRatingRequest={handleEditRating}
          />
          {activeSubTab === 'movies' ? (
            <DataTable 
              onEditRating={handleEditRating} 
              sortOption={globalSortOption}
            />
          ) : (
            <ShowsDataTable 
              onEditRating={handleEditRating}
              sortOption={globalSortOption}
            />
          )}
        </>
      );
    }

    if (activeMainTab === 'stats') {
      return <Stats />;
    }

    if (activeMainTab === 'settings') {
      return <Settings />;
    }

    return null;
  };

  return (
    <div
      className="min-h-screen"
      style={{ 
        fontFamily: 'Archivo, sans-serif',
        backgroundColor: colors.background
      }}
    >
      <Header activeMainTab={activeMainTab} onMainTabChange={handleMainTabChange} />
      
      <div className="max-w-7xl mx-auto px-8 py-6 pt-[0px] pr-[28px] pb-[21px] pl-[28px]">
        {renderContent()}
      </div>
      
      <EditRatingPopup
        isOpen={isEditPopupOpen}
        onClose={closeEditPopup}
        onSubmit={handleEditSubmit}
        onAddToWatchlist={handleAddToWatchlist}
        item={editItem}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MovieDataProvider>
          <AppContent />
        </MovieDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}