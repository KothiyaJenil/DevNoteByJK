import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Layers,
  FileCode,
  Sparkles,
  Command,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    navigate,
    setIsSearchOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    logoutUser
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/90 bg-[#090d16]/95 px-4 md:px-6 backdrop-blur-md transition-colors">
      {/* Left side: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarCollapsed(prev => !prev)}
          className="hidden md:flex items-center justify-center h-9 w-9 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>

        <button
          onClick={() => navigate('dashboard')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-lg font-mono">
              <span>DevNotes</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                PRO
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between rounded-xl border border-slate-800/90 bg-slate-900/70 px-2.5 sm:px-3.5 py-2 text-xs sm:text-sm text-slate-400 hover:border-slate-700 hover:bg-slate-900 transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
            <span className="text-slate-400 group-hover:text-slate-200 truncate hidden md:inline">Search technical notes, code snippets, flows...</span>
            <span className="text-slate-400 group-hover:text-slate-200 truncate md:hidden">Search...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 text-slate-400 shrink-0">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Side: Theme Toggle, Quick Create, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-amber-300 hover:border-slate-700 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Quick Create Button */}
        <div className="relative">
          <button
            onClick={() => setShowCreateMenu(prev => !prev)}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/15 transition-all focus:outline-none"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          {showCreateMenu && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setShowCreateMenu(false)}
            >
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate('create-note');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <FileCode className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="font-semibold">New Note</div>
                  <div className="text-[10px] text-slate-400">Save code, concepts & points</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate('create-flow');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-left"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <div>
                  <div className="font-semibold">New Notes Flow</div>
                  <div className="text-[10px] text-slate-400">Connect sequence of notes</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Profile / Auth State */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors focus:outline-none"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 rounded-lg object-cover ring-2 ring-emerald-500/40"
              />
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Settings & Profile</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logoutUser();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('login')}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate('signup')}
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
