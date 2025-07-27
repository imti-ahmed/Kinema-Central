import { useAuth } from "./AuthContext";

export function DebugAuth() {
  const { user, profile, loading, error, isAuthenticated } = useAuth();

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#000',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}
    >
      <div><strong>Debug Auth State:</strong></div>
      <div>Loading: {loading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User ID: {user?.id || 'null'}</div>
      <div>User Email: {user?.email || 'null'}</div>
      <div>Profile ID: {profile?.id || 'null'}</div>
      <div>Profile Username: {profile?.username || 'null'}</div>
      <div>Profile Email: {profile?.email || 'null'}</div>
      <div>Error: {error || 'none'}</div>
    </div>
  );
}