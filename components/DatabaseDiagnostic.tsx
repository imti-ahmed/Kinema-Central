import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

interface DiagnosticResult {
  users: UserProfile[];
  tablesExist: {
    movies_global: boolean;
    shows_global: boolean;
    user_profiles: boolean;
  };
  permissions: {
    canSelectMovies: boolean;
    canSelectShows: boolean;
    canSelectUsers: boolean;
  };
  moviesUserColumns: string[];
  showsUserColumns: string[];
  sampleMoviesData: any[];
  sampleShowsData: any[];
}

export function DatabaseDiagnostic() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fixingUsers, setFixingUsers] = useState(false);
  const [fixLog, setFixLog] = useState<string[]>([]);
  const { user } = useAuth();

  const runDiagnostic = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting database diagnostic...');

      const result: DiagnosticResult = {
        users: [],
        tablesExist: {
          movies_global: false,
          shows_global: false,
          user_profiles: false
        },
        permissions: {
          canSelectMovies: false,
          canSelectShows: false,
          canSelectUsers: false
        },
        moviesUserColumns: [],
        showsUserColumns: [],
        sampleMoviesData: [],
        sampleShowsData: []
      };

      // Test user_profiles table
      console.log('Testing user_profiles table...');
      try {
        const usersQuery = await supabase
          .from('user_profiles')
          .select('id, username, email, created_at')
          .order('created_at')
          .limit(20);
        
        if (!usersQuery.error) {
          result.tablesExist.user_profiles = true;
          result.permissions.canSelectUsers = true;
          result.users = usersQuery.data || [];
          console.log(`✓ user_profiles table accessible, ${result.users.length} users found`);
        } else {
          console.log('✗ user_profiles error:', usersQuery.error);
        }
      } catch (e) {
        console.log('✗ user_profiles exception:', e);
      }

      // Test movies_global table
      console.log('Testing movies_global table...');
      try {
        const moviesQuery = await supabase
          .from('movies_global')
          .select('*')
          .limit(3);
        
        if (!moviesQuery.error) {
          result.tablesExist.movies_global = true;
          result.permissions.canSelectMovies = true;
          result.sampleMoviesData = moviesQuery.data || [];
          
          // Get column names from the first row
          if (result.sampleMoviesData.length > 0) {
            const allColumns = Object.keys(result.sampleMoviesData[0]);
            const baseColumns = ['id', 'tmdb_id', 'title', 'year', 'poster_path', 'avg_rating', 'rating_count', 'created_at', 'updated_at'];
            result.moviesUserColumns = allColumns.filter(col => !baseColumns.includes(col));
          }
          
          console.log(`✓ movies_global table accessible, ${result.moviesUserColumns.length} user columns found`);
        } else {
          console.log('✗ movies_global error:', moviesQuery.error);
        }
      } catch (e) {
        console.log('✗ movies_global exception:', e);
      }

      // Test shows_global table
      console.log('Testing shows_global table...');
      try {
        const showsQuery = await supabase
          .from('shows_global')
          .select('*')
          .limit(3);
        
        if (!showsQuery.error) {
          result.tablesExist.shows_global = true;
          result.permissions.canSelectShows = true;
          result.sampleShowsData = showsQuery.data || [];
          
          // Get column names from the first row
          if (result.sampleShowsData.length > 0) {
            const allColumns = Object.keys(result.sampleShowsData[0]);
            const baseColumns = ['id', 'tmdb_id', 'title', 'year', 'total_seasons', 'poster_path', 'avg_rating', 'rating_count', 'avg_watched_seasons', 'created_at', 'updated_at'];
            result.showsUserColumns = allColumns.filter(col => !baseColumns.includes(col));
          }
          
          console.log(`✓ shows_global table accessible, ${result.showsUserColumns.length} user columns found`);
        } else {
          console.log('✗ shows_global error:', showsQuery.error);
        }
      } catch (e) {
        console.log('✗ shows_global exception:', e);
      }

      console.log('Diagnostic complete');
      setDiagnostic(result);

    } catch (err) {
      console.error('Diagnostic error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fixUserColumns = async () => {
    if (!diagnostic) return;

    setFixingUsers(true);
    setFixLog([]);
    
    try {
      console.log('Starting user column fix...');
      const log: string[] = ['Starting fix process...'];
      setFixLog([...log]);

      // Find missing users
      const missingFromMovies = diagnostic.users.filter(user => 
        !diagnostic.moviesUserColumns.includes(user.username)
      );
      const missingFromShows = diagnostic.users.filter(user => 
        !diagnostic.showsUserColumns.includes(user.username)
      );

      log.push(`Found ${missingFromMovies.length} users missing from movies_global`);
      log.push(`Found ${missingFromShows.length} users missing from shows_global`);
      setFixLog([...log]);

      // Add missing users to movies_global
      for (const user of missingFromMovies) {
        try {
          log.push(`Adding ${user.username} to movies_global...`);
          setFixLog([...log]);

          const { error } = await supabase.rpc('sql', {
            query: `ALTER TABLE public.movies_global ADD COLUMN "${user.username}" DECIMAL(3,1)`
          });

          if (error) {
            log.push(`  ✗ Error: ${error.message}`);
          } else {
            log.push(`  ✓ Successfully added ${user.username} to movies_global`);
          }
          setFixLog([...log]);
        } catch (err) {
          log.push(`  ✗ Exception: ${err}`);
          setFixLog([...log]);
        }
      }

      // Add missing users to shows_global
      for (const user of missingFromShows) {
        try {
          log.push(`Adding ${user.username} to shows_global...`);
          setFixLog([...log]);

          const { error } = await supabase.rpc('sql', {
            query: `ALTER TABLE public.shows_global ADD COLUMN "${user.username}" DECIMAL(3,1)`
          });

          if (error) {
            log.push(`  ✗ Error: ${error.message}`);
          } else {
            log.push(`  ✓ Successfully added ${user.username} to shows_global`);
          }
          setFixLog([...log]);
        } catch (err) {
          log.push(`  ✗ Exception: ${err}`);
          setFixLog([...log]);
        }
      }

      log.push('Fix process completed. Re-running diagnostic...');
      setFixLog([...log]);

      // Re-run diagnostic to see results
      await runDiagnostic();

    } catch (err) {
      console.error('Fix error:', err);
      setError(err instanceof Error ? err.message : 'Error fixing user columns');
    } finally {
      setFixingUsers(false);
    }
  };

  // Alternative method using direct SQL execution
  const fixUserColumnsDirectSQL = async () => {
    if (!diagnostic) return;

    setFixingUsers(true);
    setFixLog([]);
    
    try {
      const log: string[] = ['Starting direct SQL fix...'];
      setFixLog([...log]);

      const missingFromMovies = diagnostic.users.filter(user => 
        !diagnostic.moviesUserColumns.includes(user.username)
      );
      const missingFromShows = diagnostic.users.filter(user => 
        !diagnostic.showsUserColumns.includes(user.username)
      );

      log.push(`Will add ${missingFromMovies.length} users to movies_global`);
      log.push(`Will add ${missingFromShows.length} users to shows_global`);
      setFixLog([...log]);

      // Build SQL commands
      const sqlCommands: string[] = [];
      
      for (const user of missingFromMovies) {
        sqlCommands.push(`ALTER TABLE public.movies_global ADD COLUMN "${user.username}" DECIMAL(3,1);`);
      }
      
      for (const user of missingFromShows) {
        sqlCommands.push(`ALTER TABLE public.shows_global ADD COLUMN "${user.username}" DECIMAL(3,1);`);
      }

      if (sqlCommands.length > 0) {
        log.push(`Generated ${sqlCommands.length} SQL commands:`);
        sqlCommands.forEach(cmd => log.push(`  ${cmd}`));
        setFixLog([...log]);

        log.push('');
        log.push('Copy these SQL commands and run them in your Supabase SQL Editor:');
        log.push('');
        log.push('-- Start of SQL Commands --');
        sqlCommands.forEach(cmd => log.push(cmd));
        log.push('-- End of SQL Commands --');
      } else {
        log.push('No SQL commands needed - all users already have columns!');
      }

      setFixLog([...log]);

    } catch (err) {
      console.error('Fix error:', err);
      setError(err instanceof Error ? err.message : 'Error generating fix commands');
    } finally {
      setFixingUsers(false);
    }
  };

  useEffect(() => {
    if (user) {
      runDiagnostic();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-medium mb-4">Database Diagnostic</h2>
        <p>Running diagnostic checks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-medium mb-4">Database Diagnostic</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={runDiagnostic}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!diagnostic) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-xl font-medium mb-4">Database Diagnostic</h2>
        <p>No diagnostic data available.</p>
      </div>
    );
  }

  const missingUsers = {
    movies: diagnostic.users.filter(user => !diagnostic.moviesUserColumns.includes(user.username)),
    shows: diagnostic.users.filter(user => !diagnostic.showsUserColumns.includes(user.username))
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Database Diagnostic</h2>
        <button 
          onClick={runDiagnostic}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Tables Status */}
      <div className="bg-gray-50 rounded p-4">
        <h3 className="font-medium mb-2">Table Accessibility</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <span className={diagnostic.tablesExist.movies_global ? "text-green-600" : "text-red-600"}>
              {diagnostic.tablesExist.movies_global ? "✓" : "✗"}
            </span>
            <span>movies_global</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={diagnostic.tablesExist.shows_global ? "text-green-600" : "text-red-600"}>
              {diagnostic.tablesExist.shows_global ? "✓" : "✗"}
            </span>
            <span>shows_global</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={diagnostic.tablesExist.user_profiles ? "text-green-600" : "text-red-600"}>
              {diagnostic.tablesExist.user_profiles ? "✓" : "✗"}
            </span>
            <span>user_profiles</span>
          </div>
        </div>
      </div>

      {/* Users Summary */}
      <div className="bg-gray-50 rounded p-4">
        <h3 className="font-medium mb-2">Users Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>Total Users: <span className="font-medium">{diagnostic.users.length}</span></p>
            <p>User Columns in movies_global: <span className="font-medium">{diagnostic.moviesUserColumns.length}</span></p>
            <p>User Columns in shows_global: <span className="font-medium">{diagnostic.showsUserColumns.length}</span></p>
          </div>
          <div>
            <p className={missingUsers.movies.length === 0 ? "text-green-600" : "text-red-600"}>
              Missing from movies_global: {missingUsers.movies.length}
            </p>
            <p className={missingUsers.shows.length === 0 ? "text-green-600" : "text-red-600"}>
              Missing from shows_global: {missingUsers.shows.length}
            </p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-gray-50 rounded p-4">
        <h3 className="font-medium mb-2">All Users</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {diagnostic.users.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between text-sm">
              <span>{index + 1}. {user.username} ({user.email})</span>
              <div className="flex gap-2">
                <span className={diagnostic.moviesUserColumns.includes(user.username) ? "text-green-600" : "text-red-600"}>
                  {diagnostic.moviesUserColumns.includes(user.username) ? "M✓" : "M✗"}
                </span>
                <span className={diagnostic.showsUserColumns.includes(user.username) ? "text-green-600" : "text-red-600"}>
                  {diagnostic.showsUserColumns.includes(user.username) ? "S✓" : "S✗"}
                </span>
              </div>
            </div>
          ))}
          {diagnostic.users.length === 0 && (
            <p className="text-gray-500 text-sm">No users found</p>
          )}
        </div>
      </div>

      {/* Missing Users */}
      {(missingUsers.movies.length > 0 || missingUsers.shows.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h3 className="font-medium mb-2 text-red-700">Missing User Columns</h3>
          {missingUsers.movies.length > 0 && (
            <div className="mb-2">
              <p className="text-red-600">Missing from movies_global:</p>
              <p className="text-sm text-red-500">
                {missingUsers.movies.map(u => u.username).join(', ')}
              </p>
            </div>
          )}
          {missingUsers.shows.length > 0 && (
            <div className="mb-2">
              <p className="text-red-600">Missing from shows_global:</p>
              <p className="text-sm text-red-500">
                {missingUsers.shows.map(u => u.username).join(', ')}
              </p>
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button 
              onClick={fixUserColumns}
              disabled={fixingUsers}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {fixingUsers ? 'Fixing...' : 'Try Auto-Fix'}
            </button>
            <button 
              onClick={fixUserColumnsDirectSQL}
              disabled={fixingUsers}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Generate SQL Commands
            </button>
          </div>
        </div>
      )}

      {/* Fix Log */}
      {fixLog.length > 0 && (
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-medium mb-2">Fix Log</h3>
          <div className="text-sm font-mono bg-black text-green-400 p-3 rounded max-h-60 overflow-y-auto">
            {fixLog.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Column Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-medium mb-2">movies_global user columns ({diagnostic.moviesUserColumns.length})</h3>
          <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {diagnostic.moviesUserColumns.length > 0 ? (
              diagnostic.moviesUserColumns.map((col, index) => (
                <div key={index} className="font-medium text-blue-600">{col}</div>
              ))
            ) : (
              <p className="text-gray-500">No user columns found</p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-medium mb-2">shows_global user columns ({diagnostic.showsUserColumns.length})</h3>
          <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
            {diagnostic.showsUserColumns.length > 0 ? (
              diagnostic.showsUserColumns.map((col, index) => (
                <div key={index} className="font-medium text-blue-600">{col}</div>
              ))
            ) : (
              <p className="text-gray-500">No user columns found</p>
            )}
          </div>
        </div>
      </div>

      {/* Sample Data */}
      {(diagnostic.sampleMoviesData.length > 0 || diagnostic.sampleShowsData.length > 0) && (
        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-medium mb-2">Sample Data Preview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">movies_global sample:</h4>
              <div className="text-xs bg-white p-2 rounded max-h-32 overflow-auto">
                <pre>{JSON.stringify(diagnostic.sampleMoviesData[0] || {}, null, 2)}</pre>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">shows_global sample:</h4>
              <div className="text-xs bg-white p-2 rounded max-h-32 overflow-auto">
                <pre>{JSON.stringify(diagnostic.sampleShowsData[0] || {}, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}