import { createClient } from '@supabase/supabase-js';

console.log('🔧 Starting Supabase initialization...');
console.log('🔧 createClient function imported:', typeof createClient);

// Supabase configuration
const supabaseUrl = 'https://ngwcbqyceqjudywgauue.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nd2NicXljZXFqdWR5d2dhdXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzU0MTksImV4cCI6MjA2ODkxMTQxOX0.2OT04RnIEqsN99mJQQ-Fl2eoGwxkk1O5zposlNjqjLk';

console.log('🔧 Supabase Configuration:');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');
console.log('🔑 Anon Key Length:', supabaseAnonKey.length);

// Create Supabase client with enhanced error handling
let supabase: any = null;

try {
  console.log('🔧 Attempting to create Supabase client...');
  
  if (typeof createClient !== 'function') {
    throw new Error(`createClient is not a function, got: ${typeof createClient}`);
  }
  
  // ✅ Enhanced client configuration with fallback for IndexedDB issues
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true, // Try persistent session first
      detectSessionInUrl: true,
      storage: undefined, // Use default storage (localStorage/IndexedDB)
      storageKey: 'kinema-central-auth', // Custom storage key
      flowType: 'implicit'
    },
    global: {
      headers: {
        'X-Client-Info': 'kinema-central@1.0.0',
      },
    },
    // Add timeout configuration
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 2,
      },
    },
  });
  
  console.log('✅ Supabase client created successfully');
  console.log('🔧 Client type:', typeof supabase);
  console.log('🔧 Client has auth:', typeof supabase?.auth);
  console.log('🔧 Client URL:', supabase?.supabaseUrl);
  
} catch (error) {
  console.error('💥 Error creating Supabase client:', error);
  console.error('💥 Error details:', {
    name: error?.name,
    message: error?.message,
    createClientType: typeof createClient
  });
  
  // ✅ Try creating a fallback client without persistent session (for IndexedDB issues)
  try {
    console.log('🔄 Attempting fallback client without persistent session...');
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // ✅ Disable session persistence for fallback
        detectSessionInUrl: true,
        storage: undefined,
      },
      global: {
        headers: {
          'X-Client-Info': 'kinema-central@1.0.0-fallback',
        },
      },
    });
    console.log('✅ Fallback Supabase client created successfully (no persistence)');
  } catch (fallbackError) {
    console.error('💥 Fallback client creation also failed:', fallbackError);
    
    // Create a complete mock client
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: new Error('Supabase client creation failed') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ error: new Error('Supabase unavailable') }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase unavailable') }),
        signOut: () => Promise.resolve({ error: new Error('Supabase unavailable') }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase unavailable') })
      },
      from: () => ({
        select: () => ({ error: new Error('Supabase unavailable') }),
        insert: () => ({ error: new Error('Supabase unavailable') }),
        update: () => ({ error: new Error('Supabase unavailable') }),
        delete: () => ({ error: new Error('Supabase unavailable') }),
        eq: () => ({ error: new Error('Supabase unavailable') }),
        single: () => ({ error: new Error('Supabase unavailable') }),
        abortSignal: () => ({ error: new Error('Supabase unavailable') })
      }),
      supabaseUrl: 'mock',
      supabaseKey: 'mock'
    };
    console.log('🔧 Created complete fallback mock client');
  }
}

// ✅ Test session storage capabilities
export const testSessionStorage = () => {
  try {
    // Test localStorage
    const testKey = 'kinema-storage-test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    console.log('✅ localStorage is available');
    
    // Test if we're in incognito mode (rough check)
    try {
      const storage = window.sessionStorage;
      storage.setItem('test', '1');
      storage.removeItem('test');
      console.log('✅ sessionStorage is available');
    } catch (e) {
      console.warn('⚠️ sessionStorage blocked - might be incognito mode');
    }
    
    return true;
  } catch (e) {
    console.warn('⚠️ Storage APIs blocked:', e.message);
    return false;
  }
};

export { supabase };

// Connection status management
let isConnected = true;
let connectionChecked = false;

export const checkSupabaseConnection = async () => {
  if (connectionChecked) {
    return isConnected;
  }

  try {
    // Simple health check - try to connect to Supabase
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    isConnected = !error;
    connectionChecked = true;
    
    if (error) {
      console.warn('Supabase connection failed, falling back to demo mode:', error.message);
    } else {
      console.log('Supabase connection successful');
    }

    return isConnected;
  } catch (error) {
    console.warn('Supabase connection failed, falling back to demo mode:', error);
    isConnected = false;
    connectionChecked = true;
    return false;
  }
};

export const isSupabaseConnected = () => isConnected;

// Helper function to handle Supabase queries with fallback
export const safeSupabaseQuery = async (queryFn, fallbackData) => {
  try {
    const connected = await checkSupabaseConnection();
    
    if (!connected) {
      return { data: fallbackData, error: null, isDemo: true };
    }

    const result = await queryFn();
    
    if (result.error) {
      console.warn('Supabase query failed, using fallback data:', result.error);
      return { data: fallbackData, error: null, isDemo: true };
    }

    return { data: result.data || fallbackData, error: null, isDemo: false };
  } catch (error) {
    console.warn('Supabase query error, using fallback data:', error);
    return { data: fallbackData, error: null, isDemo: true };
  }
};

// Database types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  poster_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface Show {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  total_seasons: number;
  poster_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserMovieRating {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface UserShowRating {
  id: string;
  user_id: string;
  show_id: string;
  rating: number;
  watched_seasons: number;
  created_at: string;
  updated_at: string;
}

export interface MovieWatchlist {
  id: string;
  user_id: string;
  movie_id: string;
  created_at: string;
}

export interface ShowWatchlist {
  id: string;
  user_id: string;
  show_id: string;
  created_at: string;
}

// View types
export interface GlobalMovieView {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  poster_path: string | null;
  avg_rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface GlobalShowView {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  total_seasons: number;
  poster_path: string | null;
  avg_rating: number;
  rating_count: number;
  avg_watched_seasons: number;
  created_at: string;
  updated_at: string;
}

export interface UserMovieView {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  poster_path: string | null;
  rating: number;
  user_id: string;
  rated_at: string;
  rating_updated_at: string;
}

export interface UserShowView {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  total_seasons: number;
  poster_path: string | null;
  rating: number;
  watched_seasons: number;
  user_id: string;
  rated_at: string;
  rating_updated_at: string;
}

export interface UserMovieWatchlistView {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  poster_path: string | null;
  user_id: string;
  added_to_watchlist_at: string;
}

export interface UserShowWatchlistView {
  id: string;
  tmdb_id: number;
  title: string;
  year: number;
  total_seasons: number;
  poster_path: string | null;
  user_id: string;
  added_to_watchlist_at: string;
}