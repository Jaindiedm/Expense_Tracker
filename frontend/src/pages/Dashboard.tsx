import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

// Shape of dashboard data coming from Spring Boot
interface RecentTransaction {
  type: string;
  title: string;
  amount: number;
  date: string;
}

interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  highestExpenseCategory: string;
  recentTransactions: RecentTransaction[];
}

const fmt = (n: number | undefined) =>
  `Rs. ${(n ?? 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`;



export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data from Spring Boot when page loads
  useEffect(() => {
    api.get('/api/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const savingsRate =
    data && data.totalIncome > 0
      ? Math.max(0, Math.min(100, ((data.totalIncome - data.totalExpenses) / data.totalIncome) * 100))
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-[#1a6b4a] border-t-transparent animate-spin" />
            <p className="text-sm text-slate-400 tracking-wide">Loading your dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Navbar />

      {/* Add Hero Banner */}
      <div className="bg-gradient-to-br from-[#1a6b4a] via-[#1e7d57] to-[#145c3e] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-green-300 text-sm font-medium tracking-widest uppercase mb-1">
              Overview
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="text-green-200 text-sm mt-1">
              Here's what's happening with your finances today.
            </p>
          </div>

          {/* Balance pill */}
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 min-w-[200px]">
            <p className="text-green-200 text-xs font-medium uppercase tracking-widest mb-1">Net Balance</p>
            <p className={`text-2xl font-extrabold ${(data?.balance ?? 0) >= 0 ? 'text-white' : 'text-red-300'}`}>
              {fmt(data?.balance)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Primary stat cards*/}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Total Income */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1.5">Total Income</p>
            <p className="text-xl font-extrabold text-slate-900">{fmt(data?.totalIncome)}</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1.5">Total Expenses</p>
            <p className="text-xl font-extrabold text-rose-500">{fmt(data?.totalExpenses)}</p>
          </div>

          {/* Top Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1.5">Top Category</p>
            <p className="text-xl font-extrabold text-slate-900">
              {data?.highestExpenseCategory ?? '—'}
            </p>
          </div>
        </div>

        {/* This Month + Savings Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Monthly split */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            <p className="text-sm font-semibold text-slate-600">This Month</p>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Income</p>
                <p className="text-lg font-bold text-slate-900">{fmt(data?.monthlyIncome)}</p>
              </div>
              <div className="w-px bg-slate-100" />
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-0.5">Expenses</p>
                <p className="text-lg font-bold text-rose-500">{fmt(data?.monthlyExpenses)}</p>
              </div>
            </div>
            {/* Mini progress bar — expenses vs income */}
            {(data?.monthlyIncome ?? 0) > 0 && (
              <div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, ((data?.monthlyExpenses ?? 0) / (data?.monthlyIncome ?? 1)) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {(((data?.monthlyExpenses ?? 0) / (data?.monthlyIncome ?? 1)) * 100).toFixed(0)}% of monthly income spent
                </p>
              </div>
            )}
          </div>

          {/* Savings rate */}
          <div className="bg-gradient-to-br from-[#f0faf5] to-[#e8f5ee] rounded-2xl border border-emerald-100 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600">Savings Rate</p>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
                All Time
              </span>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-[#1a6b4a] mb-3">
                {savingsRate.toFixed(1)}%
              </p>
              <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1a6b4a] rounded-full transition-all duration-700"
                  style={{ width: `${savingsRate}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {savingsRate >= 20
                  ? 'Great savings habit!'
                  : savingsRate >= 10
                    ? 'On the right track'
                    : 'Try to save more'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">
              Recent Transactions
            </h2>
            <span className="text-xs text-slate-400">Latest 5</span>
          </div>

          {!data?.recentTransactions?.length ? (
            <div className="flex flex-col items-center justify-center py-14 text-slate-400">
              <p className="text-sm">No transactions yet. Start adding expenses or income.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {data.recentTransactions.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors group"
                >

                  {/* Title + date */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{t.title}</p>
                    <p className="text-xs text-slate-400">{t.date}</p>
                  </div>

                  {/* Badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-4 ${t.type === 'INCOME'
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                    {t.type}
                  </span>

                  {/* Amount */}
                  <p className={`text-sm font-bold tabular-nums ${t.type === 'INCOME' ? 'text-slate-900' : 'text-rose-500'
                    }`}>
                    {t.type === 'INCOME' ? '+' : '−'} Rs.{' '}
                    {Number(t.amount).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}