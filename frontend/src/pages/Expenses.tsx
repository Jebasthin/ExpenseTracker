import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, Search, ArrowUpDown, ChevronLeft, 
  ChevronRight, Sparkles, Filter, Calendar, Info, RefreshCw, X 
} from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface Expense {
  id: number;
  title: string;
  amount: string;
  category: string;
  category_display: string;
  date: string;
  description: string;
}

interface CategoryChoice {
  value: string;
  label: string;
}

const Expenses: React.FC = () => {
  const navigate = useNavigate();
  
  // Auth state check
  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      navigate('/');
    }
  }, [navigate]);

  // Expenses and filter states
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<CategoryChoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters & Pagination query parameters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [ordering, setOrdering] = useState('-date');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Form states (Add/Edit)
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Stats
  const [totalSpent, setTotalSpent] = useState(0);
  const [highestCategory, setHighestCategory] = useState({ name: 'None', amount: 0 });

  // Fetch expenses
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/expenses/', {
        params: {
          search,
          category,
          ordering,
          page
        }
      });
      setExpenses(response.data.results);
      setTotalCount(response.data.count);
      
      // Dynamic page calculation (page_size in backend is 5)
      const calculatedPages = Math.ceil(response.data.count / 5);
      setTotalPages(calculatedPages || 1);

      // Save categories metadata if received
      if (response.data.categories) {
        setCategories(response.data.categories);
      }
    } catch (err: any) {
      console.error(err);
      setError('Could not fetch expenses. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch full expenses list for stats (without pagination limits)
  const calculateStats = async () => {
    try {
      // Get all pages or a larger set of records to aggregate stats
      const response = await api.get('/expenses/', { params: { page_size: 1000 } });
      const allExpenses: Expense[] = response.data.results || [];
      
      let sum = 0;
      const categoryMap: { [key: string]: number } = {};
      
      allExpenses.forEach((exp) => {
        const amt = parseFloat(exp.amount);
        sum += amt;
        
        categoryMap[exp.category_display] = (categoryMap[exp.category_display] || 0) + amt;
      });

      setTotalSpent(sum);

      // Find highest category
      let maxCatName = 'None';
      let maxCatAmt = 0;
      Object.keys(categoryMap).forEach((key) => {
        if (categoryMap[key] > maxCatAmt) {
          maxCatAmt = categoryMap[key];
          maxCatName = key;
        }
      });
      setHighestCategory({ name: maxCatName, amount: maxCatAmt });

    } catch (err) {
      console.error('Error calculating dashboard statistics:', err);
    }
  };

  // Fetch triggers
  useEffect(() => {
    fetchExpenses();
  }, [search, category, ordering, page]);

  useEffect(() => {
    calculateStats();
  }, [expenses]);

  // Handle Form Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Create / Update Expense
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.amount || !formData.date) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      setFormError('Amount must be a positive number.');
      return;
    }

    setFormLoading(true);

    try {
      if (isEditing && editId !== null) {
        // Edit mode
        await api.put(`/expenses/${editId}/`, formData);
        setIsEditing(false);
        setEditId(null);
      } else {
        // Create mode
        await api.post('/expenses/', formData);
      }
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      
      fetchExpenses();
      calculateStats();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.amount || 'Could not save expense.');
    } finally {
      setFormLoading(false);
    }
  };

  // Edit click
  const handleEditClick = (expense: Expense) => {
    setIsEditing(true);
    setEditId(expense.id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description || ''
    });
    // Scroll to form on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      title: '',
      amount: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  // Delete expense
  const handleDeleteClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await api.delete(`/expenses/${id}/`);
        fetchExpenses();
        calculateStats();
      } catch (err) {
        console.error(err);
        alert('Could not delete expense.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-light/30">
      <Navbar />

      <main className="max-w-6xl mx-auto w-full px-6 py-10 flex-grow space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cream-dark/20 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-estetika text-brownie">Expense Tracker</h1>
            <p className="text-coffee/70 font-light text-sm mt-1">Add, update, and sort your financial transaction histories.</p>
          </div>
          <button 
            onClick={() => { fetchExpenses(); calculateStats(); }}
            className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 bg-cream text-coffee hover:bg-cream-dark rounded-xl border border-cream-dark/30 transition-all"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>Sync Data</span>
          </button>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-cream-dark/30 shadow-md flex items-center space-x-4">
            <div className="p-4 bg-caramel/10 text-caramel rounded-xl">
              <Sparkles size={24} />
            </div>
            <div>
              <span className="text-xs text-coffee/60 uppercase tracking-wider block">Total Spent</span>
              <h3 className="text-2xl font-bold font-estetika text-brownie">${totalSpent.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-cream-dark/30 shadow-md flex items-center space-x-4">
            <div className="p-4 bg-brownie/10 text-brownie rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <span className="text-xs text-coffee/60 uppercase tracking-wider block">Highest Category</span>
              <h3 className="text-xl font-bold font-estetika text-brownie truncate max-w-[200px]">
                {highestCategory.name} <span className="text-xs text-coffee/60 font-sans font-light">(${highestCategory.amount.toFixed(0)})</span>
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-cream-dark/30 shadow-md flex items-center space-x-4">
            <div className="p-4 bg-coffee/10 text-coffee rounded-xl">
              <Info size={24} />
            </div>
            <div>
              <span className="text-xs text-coffee/60 uppercase tracking-wider block">Registered Records</span>
              <h3 className="text-2xl font-bold font-estetika text-brownie">{totalCount} items</h3>
            </div>
          </div>
        </div>

        {/* Core Layout: Form and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-cream-dark/30 shadow-xl sticky top-24">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold font-estetika text-brownie flex items-center space-x-2">
                <span>{isEditing ? 'Edit Expense' : 'Log New Expense'}</span>
              </h2>
              {isEditing && (
                <button 
                  onClick={handleCancelEdit}
                  className="p-1 text-coffee/50 hover:text-brownie rounded-lg"
                  title="Cancel Edit"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-coffee mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Groceries, Coffee"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-cream-light/30 border border-cream-dark/60 rounded-xl text-brownie text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-coffee mb-1.5">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-cream-light/30 border border-cream-dark/60 rounded-xl text-brownie text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-coffee mb-1.5">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 bg-cream-light/30 border border-cream-dark/60 rounded-xl text-brownie text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))
                    ) : (
                      <>
                        <option value="Food">Food & Dining</option>
                        <option value="Transport">Transportation</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Leisure</option>
                        <option value="Rent">Housing/Rent</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee mb-1.5">Transaction Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-cream-light/30 border border-cream-dark/60 rounded-xl text-brownie text-sm focus:outline-none focus:ring-2 focus:ring-caramel"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-coffee mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Optional details..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-cream-light/30 border border-cream-dark/60 rounded-xl text-brownie text-sm focus:outline-none focus:ring-2 focus:ring-caramel resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-caramel hover:bg-coffee text-white font-medium rounded-xl shadow hover:shadow-md transition-all text-sm font-serif-aesthetic tracking-wide flex justify-center items-center"
              >
                {formLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  isEditing ? 'Update Transaction' : 'Record Transaction'
                )}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full py-3 bg-cream text-brownie font-medium rounded-xl border border-cream-dark/50 transition-all text-sm"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* Right Column: Search, Filter, & CRUD Table (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Search, Filter & Order Bar */}
            <div className="bg-white rounded-2xl p-4 border border-cream-dark/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-coffee/40">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2 bg-cream-light/30 border border-cream-dark/50 rounded-xl text-brownie text-xs focus:outline-none focus:ring-2 focus:ring-caramel"
                />
              </div>

              {/* Filters */}
              <div className="flex w-full md:w-auto items-center gap-3 justify-end">
                <div className="flex items-center space-x-1.5">
                  <Filter size={14} className="text-coffee/60" />
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    className="bg-cream-light/30 border border-cream-dark/50 rounded-xl px-2 py-2 text-[11px] font-medium text-brownie focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1.5">
                  <ArrowUpDown size={14} className="text-coffee/60" />
                  <select
                    value={ordering}
                    onChange={(e) => { setOrdering(e.target.value); setPage(1); }}
                    className="bg-cream-light/30 border border-cream-dark/50 rounded-xl px-2 py-2 text-[11px] font-medium text-brownie focus:outline-none"
                  >
                    <option value="-date">Date: Newest</option>
                    <option value="date">Date: Oldest</option>
                    <option value="-amount">Amount: Highest</option>
                    <option value="amount">Amount: Lowest</option>
                    <option value="title">Title: A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-cream-dark/30 shadow-xl overflow-hidden min-h-[400px] flex flex-col justify-between">
              
              {loading ? (
                <div className="flex-grow flex items-center justify-center p-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-10 h-10 border-4 border-caramel border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-coffee font-light">Loading transactions...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex-grow flex items-center justify-center p-12 text-center">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              ) : expenses.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <span className="text-4xl text-coffee/30">📜</span>
                  <div>
                    <h4 className="text-base font-bold text-brownie font-estetika">No transactions found</h4>
                    <p className="text-xs text-coffee/60 font-light mt-1">Start by recording your first expense in the left panel.</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-cream-light/30 border-b border-cream-dark/20 text-coffee/70 font-semibold uppercase tracking-wider">
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6">Title</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Amount</th>
                        <th className="py-4 px-6 hidden md:table-cell">Description</th>
                        <th className="py-4 px-6 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-dark/15">
                      {expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-cream-light/10 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap text-coffee/80">{exp.date}</td>
                          <td className="py-4 px-6 font-semibold text-brownie whitespace-nowrap">{exp.title}</td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-2.5 py-1 bg-cream border border-cream-dark/40 rounded-full text-[10px] text-coffee font-semibold">
                              {exp.category_display}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-brownie whitespace-nowrap">${parseFloat(exp.amount).toFixed(2)}</td>
                          <td className="py-4 px-6 text-coffee/70 max-w-[150px] truncate hidden md:table-cell" title={exp.description}>
                            {exp.description || '—'}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => handleEditClick(exp)}
                                className="p-1.5 text-coffee hover:text-caramel hover:bg-cream/40 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(exp.id)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination controls */}
              {expenses.length > 0 && (
                <div className="border-t border-cream-dark/20 p-4 flex items-center justify-between bg-cream-light/10">
                  <span className="text-[11px] text-coffee/70 font-light">
                    Showing page <strong className="text-brownie">{page}</strong> of <strong className="text-brownie">{totalPages}</strong> ({totalCount} total entries)
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-1.5 border border-cream-dark/50 hover:bg-cream rounded-lg text-brownie transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-1.5 border border-cream-dark/50 hover:bg-cream rounded-lg text-brownie transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Expenses;
