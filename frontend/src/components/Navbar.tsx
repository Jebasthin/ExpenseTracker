import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, LogOut, Home, CircleDollarSign, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-cream-dark/20 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm">
      {/* Brand logo */}
      <Link to="/home" className="flex items-center space-x-2">
        <div className="p-1.5 bg-caramel/10 text-caramel rounded-lg border border-caramel/20">
          <Coffee size={20} />
        </div>
        <span className="font-estetika text-xl tracking-wide text-brownie font-bold">cozyLedger</span>
      </Link>

      {/* Nav Links */}
      <div className="hidden sm:flex items-center space-x-8">
        <Link
          to="/home"
          className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${
            isActive('/home')
              ? 'text-caramel font-semibold'
              : 'text-coffee/80 hover:text-brownie'
          }`}
        >
          <Home size={16} />
          <span>Home</span>
        </Link>
        <Link
          to="/expenses"
          className={`flex items-center space-x-1.5 text-sm font-medium transition-colors ${
            isActive('/expenses')
              ? 'text-caramel font-semibold'
              : 'text-coffee/80 hover:text-brownie'
          }`}
        >
          <CircleDollarSign size={16} />
          <span>Expenses</span>
        </Link>
      </div>

      {/* User Section / Actions */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 bg-cream/50 px-3.5 py-1.5 rounded-full border border-cream-dark/30">
          <User size={14} className="text-coffee" />
          <span className="text-xs font-medium text-brownie">{username}</span>
        </div>
        
        {/* Mobile quick links */}
        <Link
          to="/expenses"
          className="sm:hidden p-2 text-coffee/80 hover:text-brownie hover:bg-cream/40 rounded-xl transition-all"
          title="Expenses"
        >
          <CircleDollarSign size={20} />
        </Link>

        <button
          onClick={handleLogout}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all flex items-center space-x-1.5 text-sm font-medium border border-transparent hover:border-red-100"
          title="Sign Out"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
