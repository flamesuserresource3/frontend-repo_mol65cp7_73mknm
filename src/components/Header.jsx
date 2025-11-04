import React from 'react';
import { Home, UserPlus } from 'lucide-react';

const Header = ({ onNavigate, current }) => {
  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/60 border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pink-200 text-pink-700 font-bold">VR</span>
          <span className="text-lg font-semibold text-slate-700">Vibe Rooms</span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-pink-300 ${
              current === 'home'
                ? 'bg-pink-200 text-pink-800 shadow-sm'
                : 'text-slate-600 hover:bg-pink-100'
            }`}
          >
            <Home className="h-4 w-4" />
            Home
          </button>
          <button
            onClick={() => onNavigate('register')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-pink-300 ${
              current === 'register'
                ? 'bg-violet-200 text-violet-800 shadow-sm'
                : 'text-slate-600 hover:bg-violet-100'
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
