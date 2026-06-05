import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

// Categories matching the Java enum exactly
const CATEGORIES = [
  "FOOD",
  "TRANSPORT",
  "BILLS",
  "SHOPPING",
  "ENTERTAINMENT",
  "OTHER",
];

// Shape of one expense record
interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  transactionDate: string;
  note: string;
}

// Empty form state — reused for both add and edit
const emptyForm = {
  title: "",
  category: "FOOD",
  amount: "",
  transactionDate: "",
  note: "",
};

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controls whether the form is visible
  const [showForm, setShowForm] = useState(false);

  // If editingId is set, form is in edit mode. If null, it's add mode.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Load all expenses when page opens
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/api/expenses");
      setExpenses(res.data);
    } catch {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  // Handle any form field change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Open form in ADD mode
  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  // Open form in EDIT mode with existing data filled in
  const handleEdit = (expense: Expense) => {
    setForm({
      title: expense.title,
      category: expense.category,
      amount: String(expense.amount),
      transactionDate: expense.transactionDate,
      note: expense.note || "",
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE existing expense — PUT request
        await api.put(`/api/expenses/${editingId}`, form);
      } else {
        // CREATE new expense — POST request
        await api.post("/api/expenses", form);
      }
      // Refresh list and close form
      fetchExpenses();
      setShowForm(false);
      setForm(emptyForm);
    } catch {
      setError("Failed to save expense");
    }
  };

  const handleDelete = async (id: number) => {
    // Ask user to confirm before deleting
    if (!confirm("Delete this expense?")) return;
    try {
      await api.delete(`/api/expenses/${id}`);
      // Remove from list without refetching
      setExpenses(expenses.filter((e) => e.id !== id));
    } catch {
      setError("Failed to delete expense");
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

  // Sort expenses by date descending
  const sortedExpenses = [...expenses].sort((a, b) =>
    b.transactionDate.localeCompare(a.transactionDate)
  );

  const thisMonthExpenses = sortedExpenses.filter((e) => isCurrentMonth(e.transactionDate));
  const lastMonthsExpenses = sortedExpenses.filter((e) => !isCurrentMonth(e.transactionDate));

  // Color badge for each category
  const categoryColor: Record<string, string> = {
    FOOD: "bg-orange-50 text-orange-600 border border-orange-100",
    TRANSPORT: "bg-blue-50 text-blue-600 border border-blue-100",
    BILLS: "bg-red-50 text-red-600 border border-red-100",
    SHOPPING: "bg-pink-50 text-pink-600 border border-pink-100",
    ENTERTAINMENT: "bg-purple-50 text-purple-600 border border-purple-100",
    OTHER: "bg-slate-100 text-slate-700 border border-slate-200",
  };

  const renderTable = (list: Expense[]) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 font-bold uppercase tracking-wider text-xs border-b border-slate-100">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {expense.title}
                </td>
                <td className="px-6 py-4">
                  {/* Colored category badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColor[expense.category]}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {expense.transactionDate}
                </td>
                <td className="px-6 py-4 text-right font-bold text-rose-500 tabular-nums">
                  Rs. {Number(expense.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  {/* Edit button */}
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-[#1a6b4a] hover:text-[#15543a] text-xs font-semibold transition-colors duration-200"
                  >
                    Edit
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(expense.id)}
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
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Expenses</h1>
            <p className="text-sm text-slate-400 mt-1">Track, edit, and organize your outgoing payments.</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-[#1a6b4a] hover:bg-[#15543a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition duration-200"
          >
            + Add Expense
          </button>
        </div>
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Add / Edit Form — only shown when showForm is true */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              {editingId ? "Edit Expense" : "Add New Expense"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Lunch"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Category dropdown */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                  placeholder="500.00"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  name="transactionDate"
                  type="date"
                  value={form.transactionDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Note — spans full width */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Note (optional)
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Any additional details..."
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b4a] focus:border-[#1a6b4a] transition duration-200"
                />
              </div>

              {/* Form buttons */}
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

        {/* Grouped list of expenses */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <p className="text-slate-400 text-sm">
              No expenses yet. Click + Add Expense to start.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* This Month Section */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                This Month
              </h2>
              {thisMonthExpenses.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <p className="text-slate-400 text-sm">No expenses recorded this month.</p>
                </div>
              ) : (
                renderTable(thisMonthExpenses)
              )}
            </div>

            {/* Last Months Section */}
            {lastMonthsExpenses.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Last Months
                </h2>
                {renderTable(lastMonthsExpenses)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
