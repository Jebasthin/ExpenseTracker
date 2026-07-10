import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, Coffee as CoffeeIcon } from 'lucide-react';
import api from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', username);
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Invalid username or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-light p-4 font-sans selection:bg-caramel-light selection:text-white">
      {/* Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-cream-dark/20 animate-fade-in">
        
        {/* Left Side: Elegant Branding Graphic */}
        <div className="md:w-1/2 bg-brownie text-cream flex flex-col justify-between p-8 md:p-12 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-coffee/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-caramel/10 rounded-full blur-3xl -ml-28 -mb-28"></div>
          
          <div className="flex items-center space-x-2 z-10">
            <div className="p-2.5 bg-caramel/20 backdrop-blur-md rounded-xl border border-caramel/30 text-caramel-light">
              <CoffeeIcon size={24} />
            </div>
            <span className="font-estetika text-2xl tracking-wide text-caramel-light font-bold">cozyLedger</span>
          </div>

          <div className="my-auto py-12 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-estetika leading-tight text-cream mb-6">
              Track your <br />
              <span className="text-caramel-light italic">expenses</span> cozy & <br />
              effortlessly.
            </h1>
            <p className="text-cream-dark text-lg max-w-md leading-relaxed font-light">
              Welcome back to your financial coffee corner. Pour a cup, check your balances, and log your daily expenses.
            </p>
          </div>

          <div className="z-10 text-xs text-cream-dark/60 font-light">
            &copy; 2026 cozyLedger Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-cream-light/30">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold font-estetika text-brownie mb-2">Welcome Back</h2>
            <p className="text-coffee/70 font-light">Please log in to manage your budget dashboard.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in">
              <AlertCircle size={20} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-brownie mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee/40">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-cream-dark/50 rounded-2xl text-brownie focus:outline-none focus:ring-2 focus:ring-caramel focus:border-transparent transition-all placeholder:text-coffee/30 shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-brownie">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee/40">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-cream-dark/50 rounded-2xl text-brownie focus:outline-none focus:ring-2 focus:ring-caramel focus:border-transparent transition-all placeholder:text-coffee/30 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-caramel hover:bg-coffee text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center font-serif-aesthetic tracking-wide"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-coffee/70 font-light">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-caramel hover:text-brownie transition-colors underline decoration-caramel/30 underline-offset-4"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
