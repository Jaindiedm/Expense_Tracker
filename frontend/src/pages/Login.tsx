import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  // Store what user types in the form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    // Stop page from refreshing
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call Spring Boot login endpoint
      const res = await api.post('/api/auth/login', { email, password });
      // Save token to sessionStorage via AuthContext
      login(res.data);
      // Go to dashboard
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex flex-col items-center justify-center py-12 px-4 font-sans">
      {/* Login Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 w-full max-w-[420px] flex flex-col">
        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-slate-800 text-center tracking-tight">
          Login to ExpenseTracker
        </h1>
        <p className="text-slate-400 text-xs text-center mt-1.5 mb-8">
          Please enter your credentials to log in.
        </p>

        {/* Error box */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-3.5 py-2.5 rounded-xl mb-5 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-50 focus:bg-white text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a]/20 focus:border-[#1a6b4a] transition duration-150"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-50 focus:bg-white text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a]/20 focus:border-[#1a6b4a] transition duration-150"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a6b4a] hover:bg-[#15543a] disabled:bg-[#a3cfbb] text-white font-semibold py-3.5 rounded-xl text-sm transition duration-150 cursor-pointer mt-2"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Create account link */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#1a6b4a] hover:underline font-semibold transition">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
