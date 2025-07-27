import { useAuth } from './AuthContext';
import { testSessionStorage } from '../lib/supabase';
import { supabase } from '../lib/supabase';

// Add comprehensive connection testing
const testSupabaseConnection = async () => {
  console.log('🔍 Starting comprehensive Supabase diagnostics...');
  
  // Test 1: Basic URL accessibility
  try {
    console.log('📡 Test 1: Testing basic URL accessibility...');
    const response = await fetch('https://ngwcbqyceqjudywgauue.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nd2NicXljZXFqdWR5d2dhdXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzU0MTksImV4cCI6MjA2ODkxMTQxOX0.2OT04RnIEqsN99mJQQ-Fl2eoGwxkk1O5zposlNjqjLk'
      }
    });
    console.log('📡 URL Response Status:', response.status);
    console.log('📡 URL Response OK:', response.ok);
    if (response.ok) {
      console.log('✅ Basic URL is accessible');
    } else {
      console.error('❌ URL accessibility failed:', response.statusText);
    }
  } catch (error) {
    console.error('💥 URL accessibility test failed:', error);
  }
  
  // Test 2: Auth endpoint specifically
  try {
    console.log('🔐 Test 2: Testing auth endpoint...');
    const authResponse = await fetch('https://ngwcbqyceqjudywgauue.supabase.co/auth/v1/settings', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nd2NicXljZXFqdWR5d2dhdXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzU0MTksImV4cCI6MjA2ODkxMTQxOX0.2OT04RnIEqsN99mJQQ-Fl2eoGwxkk1O5zposlNjqjLk'
      }
    });
    console.log('🔐 Auth Response Status:', authResponse.status);
    if (authResponse.ok) {
      console.log('✅ Auth endpoint is accessible');
    } else {
      console.error('❌ Auth endpoint failed:', authResponse.statusText);
    }
  } catch (error) {
    console.error('💥 Auth endpoint test failed:', error);
  }
  
  // Test 3: Supabase client initialization
  try {
    console.log('⚙️ Test 3: Testing Supabase client...');
    console.log('⚙️ Client created successfully');
    console.log('⚙️ Supabase URL from client:', supabase.supabaseUrl);
    console.log('⚙️ Supabase Key from client:', supabase.supabaseKey.substring(0, 20) + '...');
  } catch (error) {
    console.error('💥 Supabase client test failed:', error);
  }
};

export function AuthDebugger() {
  const { user, profile, isAuthenticated, loading } = useAuth();
  const storageWorking = testSessionStorage();

  const testProfileCreation = async () => {
    if (!user) return;
    
    console.log('🧪 Testing manual profile creation...');
    
    try {
      // First check if profile already exists with timeout
      console.log('🔍 Checking if profile already exists...');
      
      const profileCheckPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Profile check timeout')), 10000)
      );
      
      const profileResult = await Promise.race([profileCheckPromise, timeoutPromise]);
      const { data: existingProfile, error: fetchError } = profileResult as any;
        
      console.log('🔍 Existing profile check result:', { 
        hasData: !!existingProfile, 
        error: fetchError ? { code: fetchError.code, message: fetchError.message } : null 
      });
      
      if (existingProfile) {
        console.log('✅ Profile exists! Reloading to refresh context...');
        window.location.reload();
        return;
      }
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Profile check failed with error:', fetchError);
        return;
      }
      
      // Try to create profile directly
      const username = user.user_metadata?.username || user.email?.split('@')[0] || 'TestUser';
      
      console.log('🧪 Creating new profile with data:', {
        id: user.id,
        username: username,
        email: user.email
      });
      
      const createPromise = supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          username: username,
          email: user.email || ''
        })
        .select()
        .single();
        
      const createResult = await Promise.race([createPromise, timeoutPromise]);
      const { data, error } = createResult as any;
        
      console.log('🧪 Manual profile creation result:', { 
        hasData: !!data, 
        error: error ? { code: error.code, message: error.message } : null 
      });
      
      if (data) {
        console.log('✅ Manual profile creation succeeded');
        window.location.reload();
      } else if (error) {
        console.error('❌ Manual creation failed:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      }
    } catch (error) {
      console.error('💥 Manual profile creation failed:', error);
      if (error.message === 'Profile check timeout') {
        console.error('🕒 Connection timed out - check network or Supabase config');
      }
    }
  };

  if (!user) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.2)',
      color: 'rgba(255,255,255,0.7)',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      opacity: 0.3,
      transition: 'opacity 0.2s ease',
    }}
    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}>
      <h4>Auth Debug Info:</h4>
      <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
      <p><strong>Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
      <p><strong>User ID:</strong> {user?.id}</p>
      <p><strong>User Email:</strong> {user?.email}</p>
      <p><strong>Profile Loaded:</strong> {profile ? 'true' : 'false'}</p>
      {profile && (
        <>
          <p><strong>Profile Username:</strong> {profile.username}</p>
          <p><strong>Profile Email:</strong> {profile.email}</p>
        </>
      )}
      {user?.user_metadata && (
        <p><strong>User Metadata Username:</strong> {user.user_metadata.username}</p>
      )}
      <p><strong>User Role:</strong> {user?.role || 'undefined'}</p>
      <p><strong>Email Confirmed:</strong> {user?.email_confirmed_at ? 'Yes' : 'No'}</p>
      <p><strong>Supabase Client:</strong> {supabase?.supabaseUrl === 'mock' ? '❌ Mock Client' : '✅ Real Client'}</p>
      <p><strong>Storage Available:</strong> {storageWorking ? '✅ Yes' : '❌ Blocked'}</p>
      {!storageWorking && (
        <p style={{ color: 'rgba(255, 107, 107, 0.8)', fontSize: '11px', marginTop: '2px' }}>
          ⚠️ Storage blocked - disable privacy extensions or try different browser
        </p>
      )}
      {isAuthenticated && (
        <p style={{ color: profile ? 'rgba(40, 167, 69, 0.8)' : 'rgba(255, 193, 7, 0.8)', fontSize: '11px', marginTop: '5px' }}>
          {profile ? (
            <><strong>✅ Profile Status:</strong> {profile.id.includes('-') ? 'Using fallback profile' : 'Database profile loaded'}</>
          ) : (
            <><strong>⚠️ RLS Policy Issue:</strong> Profile queries are timing out. Click "📋 Copy RLS Fix SQL" below.</>
          )}
        </p>
      )}
      {!profile && (
        <>
          <button 
            onClick={testProfileCreation}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '10px',
              fontSize: '11px',
              display: 'block',
              width: '100%'
            }}
          >
            🔧 Create Profile Manually
          </button>
          <button 
            onClick={async () => {
              console.log('🧪 Testing database connection...');
              try {
                const dbTestPromise = supabase
                  .from('user_profiles')
                  .select('*', { count: 'exact' })
                  .limit(1);
                
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Database connection timeout')), 10000)
                );
                
                const result = await Promise.race([dbTestPromise, timeoutPromise]);
                const { data, error, count } = result as any;
                
                console.log('🧪 DB Test Result:', { 
                  hasData: !!data, 
                  dataLength: data?.length || 0,
                  count,
                  error: error ? { code: error.code, message: error.message } : null 
                });
                
                if (error) {
                  console.error('❌ Database test failed:', error);
                } else {
                  console.log('✅ Database connection successful');
                }
              } catch (err) {
                console.error('💥 DB Test Failed:', err);
                if (err.message === 'Database connection timeout') {
                  console.error('🕒 Database connection timed out - check Supabase config');
                }
              }
            }}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '5px',
              fontSize: '11px',
              display: 'block',
              width: '100%'
            }}
          >
            🔗 Test DB Connection
          </button>
          <button 
            onClick={async () => {
              console.log('🔒 Testing RLS Policy Issues...');
              try {
                // Test basic table access
                const testPromise = supabase
                  .from('user_profiles')
                  .select('id')
                  .limit(1);
                
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('RLS test timeout')), 8000)
                );
                
                const result = await Promise.race([testPromise, timeoutPromise]);
                const { data, error } = result as any;
                
                console.log('🔒 RLS Test Result:', { 
                  hasData: !!data, 
                  error: error ? { 
                    code: error.code, 
                    message: error.message,
                    details: error.details,
                    hint: error.hint 
                  } : null 
                });
                
                if (error) {
                  if (error.code === '42501' || error.message?.includes('policy') || error.message?.includes('RLS')) {
                    console.error('🔒 CONFIRMED: Row Level Security (RLS) policy issue!');
                    console.error('🔒 SOLUTION: You need to add an RLS policy to user_profiles table:');
                    console.error('🔒 SQL: create policy "User can read own profile" on user_profiles for select using (auth.uid() = id);');
                  } else {
                    console.error('❌ Different database error:', error);
                  }
                } else {
                  console.log('✅ Table access works - RLS policies are correctly configured');
                }
              } catch (err) {
                console.error('💥 RLS Test Failed:', err);
              }
            }}
            style={{
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '5px',
              fontSize: '11px',
              display: 'block',
              width: '100%'
            }}
          >
            🔒 Test RLS Policies
          </button>
          <button 
            onClick={async () => {
              console.log('🌐 Testing basic Supabase connection...');
              try {
                const authTestPromise = supabase.auth.getSession();
                
                const timeoutPromise = new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Auth connection timeout')), 5000)
                );
                
                const result = await Promise.race([authTestPromise, timeoutPromise]);
                const { data, error } = result as any;
                
                console.log('🌐 Auth Test Result:', { 
                  hasSession: !!data?.session,
                  hasUser: !!data?.session?.user,
                  error: error ? { message: error.message } : null 
                });
                
                if (data?.session) {
                  console.log('✅ Supabase auth connection working');
                } else if (error) {
                  console.error('❌ Supabase auth test failed:', error);
                } else {
                  console.log('⚠️ No active session');
                }
              } catch (err) {
                console.error('💥 Supabase Auth Test Failed:', err);
                if (err.message === 'Auth connection timeout') {
                  console.error('🕒 Auth connection timed out - check network');
                }
              }
            }}
            style={{
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '5px',
              fontSize: '11px',
              display: 'block',
              width: '100%'
            }}
          >
            🌐 Test Auth Connection
          </button>
          <button 
            onClick={testSupabaseConnection}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '5px',
              fontSize: '11px',
              display: 'block',
              width: '100%'
            }}
          >
            🔍 Full Connection Diagnostic
          </button>
          <button 
            onClick={async () => {
              console.log('🔄 Creating profile from current auth data...');
              try {
                const { data: authData, error: authError } = await supabase.auth.getUser();
                console.log('🔄 Current auth data:', { 
                  hasUser: !!authData.user,
                  userId: authData.user?.id,
                  email: authData.user?.email,
                  metadata: authData.user?.user_metadata,
                  authError 
                });
                
                if (authData.user && !authError) {
                  const profileData = {
                    id: authData.user.id,
                    username: authData.user.user_metadata?.username || authData.user.email?.split('@')[0] || 'User',
                    email: authData.user.email || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  };
                  
                  console.log('🔄 Profile data created from auth:', profileData);
                  // You could also try to manually insert this into the context
                  window.location.reload(); // Refresh to trigger profile refetch
                } else {
                  console.error('❌ Could not get current auth data:', authError);
                }
              } catch (err) {
                console.error('💥 Failed to create profile from auth data:', err);
              }
            }}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '5px',
              fontSize: '11px',
              display: 'block',
              width: '100%'
            }}
          >
            🔄 Create Profile from Auth
          </button>
          <button 
            onClick={() => {
              const sqlFix = `-- Run this SQL in your Supabase SQL Editor:
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User can read own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "User can insert own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "User can update own profile" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = id);`;
              
              navigator.clipboard.writeText(sqlFix).then(() => {
                console.log('✅ SQL fix copied to clipboard!');
                alert('SQL fix copied to clipboard! Paste it in your Supabase SQL Editor.');
              }).catch(() => {
                console.log('❌ Failed to copy to clipboard');
                console.log('SQL to fix RLS policies:\n', sqlFix);
                alert('Could not copy to clipboard. Check console for SQL commands.');
              });
            }}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '5px',
              fontSize: '11px',
              display: 'block',
              width: '100%'
            }}
          >
            📋 Copy RLS Fix SQL
          </button>
        </>
      )}
    </div>
  );
}