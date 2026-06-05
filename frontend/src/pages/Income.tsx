import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

// Shape of one income record
interface Income {
  id: number;
  source: string;
  amount: number;
  receivedDate: string;
  note: string;
}

const emptyForm = { source: "", amount: "", receivedDate: "", note: "" };

export default function Income() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Load all income records when page opens
  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const res = await api.get("/api/income");
      setIncomes(res.data);
    } catch {
      setError("Failed to load income records");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open form in ADD mode
  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  // Open form in EDIT mode with existing data
  const handleEdit = (income: Income) => {
    setForm({
      source: income.source,
      amount: String(income.amount),
      receivedDate: income.receivedDate,
      note: income.note || "",
    });
    setEditingId(income.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE existing income
        await api.put(`/api/income/${editingId}`, form);
      } else {
        // CREATE new income
        await api.post("/api/income", form);
      }
      fetchIncomes();
      setShowForm(false);
      setForm(emptyForm);
    } catch {
      setError("Failed to save income");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this income record?")) return;
    try {
      await api.delete(`/api/income/${id}`);
      // Remove from list without refetching
      setIncomes(incomes.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete income");
    }
  };

  // Helper to determine if a date is in the current year/month
  const isCurrentMonth = (dateStr: string) => {
    if (!dateStr) return false;
    const [year, month] = dateStr.split('-');
    const now = new Date();
    const currentYear = String(now.getFullYear());
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    return year === currentYear && month === currentMonth;
  };

  // Sort incomes by date descending
  const sortedIncomes = [...incomes].sort((a, b) =>
    b.receivedDate.localeCompare(a.receivedDate)
  );

  const thisMonthIncomes = sortedIncomes.filter((i) => isCurrentMonth(i.receivedDate));
  const lastMonthsIncomes = sortedIncomes.filter((i) => !isCurrentMonth(i.receivedDate));

  const renderTable = (list: Income[]) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Note</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((income) => (
              <tr
                key={income.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {income.source}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {income.receivedDate}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {income.note || "—"}
                </td>
                {/* Income amount made black (slate-900) */}
                <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">
                  Rs. {Number(income.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(income)}
                    className="text-[#1a6b4a] hover:text-[#15543a] text-xs font-semibold transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-semibold transition-colors duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/60">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Income</h1>
            <p className="text-sm text-slate-400 mt-1">Track, edit, and organize your incoming revenue.</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-[#1a6b4a] hover:bg-[#15543a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200"
          >
            + Add Income
          </button>
        </div>
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {editingId ? "Edit Income" : "Add New Income"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Source */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Source
                </label>
                <input
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  placeholder="e.g. Salary, Freelance"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Amount (Rs.)
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="50000.00"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Received Date */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Received Date
                </label>
                <input
                  name="receivedDate"
                  type="date"
                  value={form.receivedDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Note (optional)
                </label>
                <input
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Any additional details..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  className="bg-[#1a6b4a] hover:bg-[#15543a] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition duration-200"
                >
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold px-6 py-2.5 rounded-xl transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grouped list of incomes */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>
        ) : incomes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-slate-400 text-sm">
              No income records yet. Click + Add Income to start.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* This Month Section */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                This Month
              </h2>
              {thisMonthIncomes.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <p className="text-slate-400 text-sm">No income recorded this month.</p>
                </div>
              ) : (
                renderTable(thisMonthIncomes)
              )}
            </div>

            {/* Last Months Section */}
            {lastMonthsIncomes.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Last Months
                </h2>
                {renderTable(lastMonthsIncomes)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
