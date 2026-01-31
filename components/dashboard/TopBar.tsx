"use client";

import { Bell, Search, Menu } from "lucide-react";

interface TopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle (Caché sur desktop) */}
        <button className="p-2 hover:bg-slate-100 rounded-lg lg:hidden text-slate-600">
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar - Responsive width */}
        <div className="flex-1 max-w-md lg:max-w-xl group">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="search"
              placeholder="Rechercher un élève, une note, un cours..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Actions Right */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
            {/* Badge de notification style StatAi */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 border-2 border-white rounded-full"></span>
          </button>

          {/* User Info - Desktop only */}
          <div className="hidden sm:flex flex-col items-end text-right ml-2 border-l border-slate-100 pl-4">
            <span className="text-sm font-semibold text-slate-800 truncate max-w-[150px]">
              {user.name}
            </span>
            <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
              {user.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
