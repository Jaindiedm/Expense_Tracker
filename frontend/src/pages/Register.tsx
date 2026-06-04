import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Register() {
  // State hooks for storing user registration inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for error handling and submission loading feedback
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Authentication context for login triggers
  const { login } = useAuth();

  // Navigation hook to redirect users after registration
  const navigate = useNavigate();

  // Handles registration form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side confirm password check
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call the Spring Boot backend registration endpoint with user credentials
      const res = await api.post('/api/auth/register', {
        name, email, password
      });

      // Automatically log the user in using the returned JWT/session data
      login(res.data);

      // Redirect authenticated user to the dashboard/home page
      navigate('/');
    } catch (err: any) {
      // Set appropriate error message to be displayed in the UI
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      // Stop the loading indicator
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
      {/* Register Card */}
      <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-slate-100 p-12 w-full max-w-[420px] flex flex-col">
        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-slate-800 text-center tracking-tight">
          Register to ExpenseTrack
        </h1>
        <p className="text-slate-400 text-xs text-center mt-1.5 mb-8">
          Please enter your details to create an account.
        </p>

        {/* Display alert message if registration fails */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-3.5 py-2.5 rounded-lg mb-5 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Register input form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-[#f5edea] focus:bg-white text-slate-700 placeholder-slate-400 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#e0569c]/30 border-0 transition duration-150"
            />
          </div>

          {/* Email Address Field */}
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

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
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

        {/* Navigation link to direct existing users to the Login view */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6f3b28] hover:underline font-semibold transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
