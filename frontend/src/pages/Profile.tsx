import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

// Shape of user profile data from backend
interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch profile when page loads
  useEffect(() => {
    api.get('/api/auth/profile')
      .then(res => setProfile(res.data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb]">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#1a6b4a] border-t-transparent animate-spin" />
            <p className="text-sm text-slate-400 tracking-wide">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="pb-5 border-b border-slate-200/60 max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your personal account details.</p>
        </div>
        {/* Error message */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl mx-auto">

          {/* Avatar circle with first letter of name */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#1a6b4a] flex items-center justify-center text-white text-2xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{profile?.name}</h2>
              <p className="text-slate-400 text-sm">{profile?.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 mb-6" />

          {/* Profile details */}
          <div className="space-y-4">

            {/* Name */}
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-400 font-medium w-32">Full Name</span>
              <span className="text-sm font-semibold text-slate-800">{profile?.name}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-400 font-medium w-32">Email Address</span>
              <span className="text-sm font-semibold text-slate-800">{profile?.email}</span>
            </div>

            {/* Member since */}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-400 font-medium w-32">Member Since</span>
              <span className="text-sm font-semibold text-slate-800">
                {/* Format the date nicely */}
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}