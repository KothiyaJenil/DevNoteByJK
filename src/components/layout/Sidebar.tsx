import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ViewMode } from '../../types';
import {
  LayoutDashboard,
  FileCode,
  GitFork,
  Star,
  Tag,
  Settings,
  Plus,
  Compass,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    navigate,
    sidebarCollapsed,
    notes,
    flows
  } = useApp();

  const favoriteNotesCount = notes.filter(n => n.isFavorite).length;
  const favoriteFlowsCount = flows.filter(f => f.isFavorite).length;

  const navItems: {
    id: ViewMode;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    subItems?: { label: string; action: () => void }[];
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      id: 'notes-list',
      label: 'Notes',
      icon: <FileCode className="h-4 w-4" />,
      badge: notes.length
    },
    {
      id: 'flows-list',
      label: 'Notes Flows',
      icon: <GitFork className="h-4 w-4" />,
      badge: flows.length
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="h-4 w-4 text-amber-400" />,
      badge: favoriteNotesCount + favoriteFlowsCount
    },
    {
      id: 'tags',
      label: 'Tags & Topics',
      icon: <Tag className="h-4 w-4 text-cyan-400" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800/90 bg-[#090d16] text-slate-300 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {/* Navigation Sections */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
              Workspace
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive =
                activeView === item.id ||
                (item.id === 'notes-list' && (activeView === 'create-note' || activeView === 'edit-note' || activeView === 'view-note')) ||
                (item.id === 'flows-list' && (activeView === 'create-flow' || activeView === 'edit-flow' || activeView === 'view-flow'));

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-emerald-400' : ''}>{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>
                  {!sidebarCollapsed && item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Shortcuts / Actions */}
        {!sidebarCollapsed && (
          <div className="pt-4 border-t border-slate-800/80">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
              Quick Actions
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigate('create-note')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900 rounded-lg transition-colors group text-left"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>New Note</span>
              </button>
              <button
                onClick={() => navigate('create-flow')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-900 rounded-lg transition-colors group text-left"
              >
                <Plus className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>New Notes Flow</span>
              </button>
              <button
                onClick={() => navigate('landing')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-900 rounded-lg transition-colors text-left mt-2"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-400" />
                <span>Product Landing Page</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding Info */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>DevNotes Concept</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Every technical concept is a Note. A Flow connects them into a coding sequence.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
