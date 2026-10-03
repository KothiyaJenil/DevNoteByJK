import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ViewMode } from '../../types';
import { LayoutDashboard, FileCode, GitFork, Star, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, navigate } = useApp();

  const navs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'notes-list', label: 'Notes', icon: <FileCode className="h-5 w-5" /> },
    { id: 'flows-list', label: 'Flows', icon: <GitFork className="h-5 w-5" /> },
    { id: 'favorites', label: 'Favorites', icon: <Star className="h-5 w-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-800 bg-[#090d16]/95 py-2 px-3 backdrop-blur-lg">
      {navs.map(item => {
        const isActive =
          activeView === item.id ||
          (item.id === 'notes-list' && (activeView === 'create-note' || activeView === 'edit-note' || activeView === 'view-note')) ||
          (item.id === 'flows-list' && (activeView === 'create-flow' || activeView === 'edit-flow' || activeView === 'view-flow'));

        return (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center gap-1 p-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
