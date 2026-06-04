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
      // Save token to localStorage via AuthContext
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
      {/* Login Card */}
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 p-12 w-full max-w-[420px] flex flex-col">
        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-slate-800 text-center tracking-tight">
          Login to ExpenseTrack
        </h1>
        <p className="text-slate-400 text-xs text-center mt-1.5 mb-8">
          Please enter your credentials to log in.
        </p>

        {/* Error box */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-3.5 py-2.5 rounded-lg mb-5 text-xs text-center font-medium">
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
              className="w-full px-4 py-3 bg-[#f5edea] focus:bg-white text-slate-700 placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e0569c]/30 border-0 transition duration-150"
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
              className="w-full px-4 py-3 bg-[#f5edea] focus:bg-white text-slate-700 placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e0569c]/30 border-0 transition duration-150"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6f3b28] hover:bg-[#5d3120] disabled:bg-[#ab9086] text-white font-medium py-3.5 rounded-lg text-sm transition duration-150 cursor-pointer mt-2"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Create account link */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#6f3b28] hover:underline font-semibold transition">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
