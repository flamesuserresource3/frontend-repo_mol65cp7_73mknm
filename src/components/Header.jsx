import React from 'react';
import { Home, UserPlus } from 'lucide-react';

const Header = ({ onNavigate, currentView }) => {
  return (
    <header className="sticky top-0 z-20 w-full backdrop-blur bg-gradient-to-r from-pink-50/70 via-purple-50/70 to-blue-50/70 border-b border-white/50">      
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-200 via-violet-200 to-blue-200 shadow-sm" />
          <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
            Pastel Rooms
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors border ${
              currentView === 'home'
                ? 'bg-white/80 text-violet-600 border-white/80'
                : 'bg-white/60 text-slate-700 hover:bg-white/80 border-white/70'
            }`}
          >
            <Home className="h-4 w-4" />
            Home
          </button>
          <button
            onClick={() => onNavigate('register')}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors border ${
              currentView === 'register'
                ? 'bg-white/80 text-pink-600 border-white/80'
                : 'bg-white/60 text-slate-700 hover:bg-white/80 border-white/70'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Register
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
