import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase, UserProfile, testSessionStorage } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, username: string) => Promise<{ error?: AuthError }>;
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<{ error?: AuthError }>;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debug profile state changes
  useEffect(() => {
    console.log('Profile state changed to:', profile);
  }, [profile]);

  useEffect(() => {
    let isComponentMounted = true;
    let authSubscription: any;
    
    // ✅ Supabase's recommended session bootstrapping pattern
    const getInitialSession = async () => {
      try {
        console.log('🔄 Getting initial session with browser readiness check...');
        
        // ✅ Only run after window is available (prevents SSR issues)
        if (typeof window === 'undefined') {
          console.log('⏳ Window not available yet, skipping session fetch');
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        // ✅ Test storage capabilities
        const storageAvailable = testSessionStorage();
        if (!storageAvailable) {
          console.warn('⚠️ Storage blocked - session persistence may not work');
        }
        
        // Check if we have a valid Supabase client
        if (!supabase || supabase.supabaseUrl === 'mock') {
          console.error('🚫 Supabase client is not available - using fallback auth');
          setUser(null);
          setProfile(null);
          setError('Authentication service unavailable. Please try refreshing the page.');
          setLoading(false);
          return;
        }
        
        console.log('✅ Browser ready, fetching session...');
        
        // ✅ Use Supabase's standard pattern without timeout racing
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('📊 Initial session result:', { 
          hasSession: !!session, 
          userId: session?.user?.id, 
          error: error ? error.message : null 
        });
        
        if (!isComponentMounted) return;
        
        if (error) {
          console.error('❌ Error getting session:', error.message);
          setUser(null);
          setProfile(null);
          setError('Connection error. Please check your internet connection.');
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Session found, setting up user...');
          setUser(session.user);
          
          // Create immediate fallback profile to prevent loops
          const fallbackProfile = {
            id: session.user.id,
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
          setError(null);
          setLoading(false);
          
          // Try to fetch real profile in background (non-blocking)
          fetchUserProfileInBackground(session.user.id);
        } else {
          console.log('ℹ️ No session found - user not logged in');
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        if (!isComponentMounted) return;
        console.error('💥 Exception in getInitialSession:', err);
        
        // ✅ Better error handling for different scenarios
        if (err.name === 'AbortError') {
          console.error('🕒 Session fetch was aborted');
        } else if (err.message?.includes('IndexedDB')) {
          console.error('💾 IndexedDB issue - may be in incognito mode or blocked');
          setError('Storage access blocked. Please disable privacy extensions or try a different browser.');
        } else {
          setError('Connection error. Please refresh the page and try again.');
        }
        
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    // ✅ Set up auth state listener using Supabase's recommended pattern
    const setupAuthListener = () => {
      try {
        console.log('🔧 Setting up auth state listener...');
        
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isComponentMounted) return;
          
          console.log('🔄 Auth state changed:', event, 'User ID:', session?.user?.id);
          
          // ✅ Handle different auth events properly
          switch (event) {
            case 'SIGNED_OUT':
              console.log('👋 User signed out, clearing state');
              setUser(null);
              setProfile(null);
              setError(null);
              setLoading(false);
              break;
              
            case 'SIGNED_IN':
              console.log('👤 User signed in, setting up profile...');
              setUser(session?.user || null);
              setError(null);
              
              if (session?.user) {
                // Create immediate fallback profile
                const fallbackProfile = {
                  id: session.user.id,
                  username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
                  email: session.user.email || '',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                setProfile(fallbackProfile);
                setLoading(false);
                
                // Try to fetch real profile in background
                fetchUserProfileInBackground(session.user.id);
              }
              break;
              
            case 'TOKEN_REFRESHED':
              console.log('🔄 Token refreshed, maintaining state');
              // Update user but keep existing profile
              setUser(session?.user || null);
              break;
              
            case 'USER_UPDATED':
              console.log('👤 User updated');
              setUser(session?.user || null);
              break;
              
            default:
              console.log('ℹ️ Other auth event:', event);
              setUser(session?.user || null);
          }
        });
        
        authSubscription = listener.subscription;
        console.log('✅ Auth listener setup successfully');
      } catch (err) {
        console.error('💥 Error setting up auth listener:', err);
        setError('Failed to setup authentication monitoring. Please refresh the page.');
        setLoading(false);
      }
    };

    // Initialize auth immediately
    getInitialSession();
    setupAuthListener();

    return () => {
      isComponentMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const fetchUserProfileInBackground = async (userId: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds max

    try {
      console.log('🔍 Background: Fetching user profile for userId:', userId);
      
      // ✅ Correct table name: user_profiles (not profiles)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .abortSignal(controller.signal)
        .single();

      clearTimeout(timeoutId);

      if (error) {
        console.log('⚠️ Background: Profile fetch failed, keeping fallback:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        
        // If profile doesn't exist (PGRST116), try to create it
        if (error.code === 'PGRST116') {
          console.log('🔧 Background: Profile not found, attempting to create...');
          const { data: authData } = await supabase.auth.getUser();
          if (authData.user && authData.user.id === userId) {
            await createUserProfileInBackground(authData.user);
          }
        }
        return;
      }

      if (data) {
        console.log('✅ Background: Real profile found, updating context');
        setProfile(data);
      }

    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err.name === 'AbortError') {
        console.warn("⚠️ Background profile fetch was aborted (timeout)");
      } else {
        console.warn("⚠️ Background profile fetch failed:", err.message);
      }
    }
  };

  const createUserProfileInBackground = async (user: User) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds max

    try {
      console.log('🔧 Background: Attempting profile creation for user:', user.id);
      
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
      const profileData = {
        id: user.id,
        username: username,
        email: user.email || ''
      };
      
      // ✅ Correct table name: user_profiles
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .abortSignal(controller.signal)
        .single();

      clearTimeout(timeoutId);

      if (error) {
        console.log('⚠️ Background profile creation failed (likely RLS policy issue):', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return;
      }

      if (data) {
        console.log('✅ Background profile created successfully:', data);
        // Update context with the real profile
        setProfile(data);
        
        // Create user personal stats in background
        await createUserPersonalStats(user, username);
      }

    } catch (err) {
      clearTimeout(timeoutId);
      
      if (err.name === 'AbortError') {
        console.warn("⚠️ Background profile creation was aborted (timeout)");
      } else {
        console.warn("⚠️ Background profile creation failed:", err.message);
      }
    }
  };

  const createUserPersonalStats = async (user: User, username: string) => {
    try {
      console.log('📊 Creating user personal stats:', { userId: user.id, username });

      // The trigger should handle this automatically, but let's ensure it exists
      const { data: existingStats } = await supabase
        .from('personal_stats')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingStats) {
        const { error: statsError } = await supabase
          .from('personal_stats')
          .insert({
            user_id: user.id,
            username: username
          });

        if (statsError) {
          console.error('❌ Error creating user personal stats:', statsError);
        } else {
          console.log('✅ User personal stats created');
        }
      } else {
        console.log('✅ User personal stats already exist');
      }

    } catch (error) {
      console.error('💥 Exception in createUserPersonalStats:', error);
    }
  };

  const createUserProfile = async (user: User) => {
    try {
      console.log('🔧 Creating user profile for user:', user.id, user.email);
      
      // Extract username from metadata or use email prefix as fallback
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
      
      console.log('🔧 Extracted username for profile creation:', username);
      console.log('🔧 User metadata:', user.user_metadata);
      console.log('🔧 User email:', user.email);
      
      const profileData = {
        id: user.id,
        username: username,
        email: user.email || ''
      };
      
      console.log('🔧 Attempting to insert profile data:', profileData);
      
      // ✅ Correct table name: user_profiles (not profiles)
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user profile:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return null;
      }

      console.log('✅ User profile created successfully:', data);
      console.log('✅ Created profile details:', {
        id: data.id,
        username: data.username,
        email: data.email
      });

      // Create user personal stats
      await createUserPersonalStats(user, username);

      return data;
    } catch (error) {
      console.error('💥 Exception in createUserProfile:', error);
      return null;
    }
  };



  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signing up user with:', { email, username });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      console.log('SignUp result:', { 
        user: data.user?.id, 
        email: data.user?.email,
        username: data.user?.user_metadata?.username,
        error 
      });

      if (error) {
        console.error('SignUp error:', error);
        setError(error.message);
        setLoading(false);
        return { error };
      }

      // If user needs email confirmation, show message and reset loading
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created but needs email confirmation');
        setError('Please check your email to confirm your account');
        setLoading(false);
      } else if (data.user) {
        console.log('User created and confirmed immediately. User metadata:', data.user.user_metadata);
        console.log('Trigger should create profile with username:', data.user.user_metadata?.username);
      }
      // If user is immediately confirmed, onAuthStateChange will handle loading state

      return {};
    } catch (error) {
      console.error('SignUp exception:', error);
      const authError = { message: 'Connection error. Please check your internet connection and try again.' } as AuthError;
      setError(authError.message);
      setLoading(false);
      return { error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Attempting sign in for email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Sign in result:', { 
        hasUser: !!data.user, 
        userId: data.user?.id,
        email: data.user?.email,
        error: error ? { code: error.message } : null 
      });

      if (error) {
        console.error('❌ SignIn error:', error);
        setError(error.message);
        setLoading(false);
        return { error };
      }

      if (data.user) {
        console.log('🔐 User signed in successfully, user metadata:', data.user.user_metadata);
        
        // Create immediate fallback profile to prevent loops
        const signInProfile = {
          id: data.user.id,
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProfile(signInProfile);
        setError(null);
        setLoading(false);
        
        // Try to fetch real profile in background
        setTimeout(() => {
          fetchUserProfileInBackground(data.user.id);
        }, 100);
      }

      // Don't set loading to false here - let onAuthStateChange handle it
      // after fetching the user profile
      return {};
    } catch (error) {
      console.error('💥 SignIn exception:', error);
      const authError = { message: 'Connection error. Please check your internet connection and try again.' } as AuthError;
      setError(authError.message);
      setLoading(false);
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('SignOut error:', error);
        setError(error.message);
        setLoading(false);
        return { error };
      }

      // Success - onAuthStateChange will handle setting loading to false
      return {};
    } catch (error) {
      console.error('SignOut exception:', error);
      const authError = { message: 'An unexpected error occurred during sign out' } as AuthError;
      setError(authError.message);
      setLoading(false);
      return { error: authError };
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isDemoMode: false, // Always false since we have working Supabase
  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}