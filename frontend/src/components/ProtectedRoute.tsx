import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps any page that requires login
// If not logged in → redirect to /login
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Wait until localStorage is checked before deciding
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  // Not logged in → send to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}