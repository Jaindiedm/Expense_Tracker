import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // useLocation tells us which page we are on (to highlight active link)
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check if a link is the current page
  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-600 hover:text-blue-600';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          💰 ExpenseTracker
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className={isActive('/')}>Dashboard</Link>
          <Link to="/expenses" className={isActive('/expenses')}>Expenses</Link>
          <Link to="/income" className={isActive('/income')}>Income</Link>
          <Link to="/profile" className={isActive('/profile')}>Profile</Link>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}