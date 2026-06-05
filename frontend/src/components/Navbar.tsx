import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check if a link is the current page
  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-[#1a6b4a] font-semibold md:border-b-2 md:border-[#1a6b4a] md:pb-0.5'
      : 'text-slate-500 hover:text-[#1a6b4a] transition-colors duration-200';

  return (
    <nav
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100"
      style={{ boxShadow: '0 1px 24px 0 rgba(26,107,74,0.04)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        {/* Wordmark — no icon */}
        <Link to="/" className="flex items-center select-none" onClick={() => setIsMenuOpen(false)}>
          <span
            style={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #1a6b4a 0%, #2ecc89 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Expense
          </span>
          <span
            style={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: '#64748b',
              marginLeft: 2,
            }}
          >
            Tracker
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" className={isActive('/')}>Dashboard</Link>
          <Link to="/expenses" className={isActive('/expenses')}>Expenses</Link>
          <Link to="/income" className={isActive('/income')}>Income</Link>
          <Link to="/profile" className={isActive('/profile')}>Profile</Link>
        </div>

        {/* Desktop User info + logout */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-slate-400 font-medium">Hi, {user?.name?.split(' ')[0]}</span>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold bg-rose-50 hover:bg-rose-100 text-rose-500 px-4 py-1.5 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition duration-150"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-4 shadow-inner">
          <div className="flex flex-col gap-3.5 text-sm font-semibold">
            <Link
              to="/"
              className={`py-1 ${isActive('/')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/expenses"
              className={`py-1 ${isActive('/expenses')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Expenses
            </Link>
            <Link
              to="/income"
              className={`py-1 ${isActive('/income')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Income
            </Link>
            <Link
              to="/profile"
              className={`py-1 ${isActive('/profile')}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <span className="text-sm text-slate-400 font-medium">Hi, {user?.name?.split(' ')[0]}</span>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="text-sm font-semibold bg-rose-50 hover:bg-rose-100 text-rose-500 px-4 py-1.5 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}