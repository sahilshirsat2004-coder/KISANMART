import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'FARMER': return '/farmer';
      case 'SHOPKEEPER': return '/shop';
      case 'DRIVER': return '/driver';
      case 'ADMIN': return '/admin';
      default: return '/';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-emerald-100/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo matching screenshot */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition duration-200">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
              Kisan<span className="text-emerald-600">Mart</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-emerald-600/70 block mt-1">
              FARM • TRADE • DELIVER
            </span>
          </div>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/shop"
            className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
          >
            Marketplace
          </Link>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath(user.role)}
                className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100 transition"
              >
                Dashboard ({user.role})
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition px-2"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-[#00C060] hover:bg-[#00ab55] text-white text-sm font-bold transition shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:-translate-y-0.5 transform duration-150"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}