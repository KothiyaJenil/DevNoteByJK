import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Sun, Moon, Download, RefreshCw, User, Code2, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    toggleTheme,
    user,
    codeFont,
    setCodeFont,
    exportKnowledgeBase,
    resetToInitialData
  } = useApp();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 font-sans text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono flex items-center gap-3">
          <Settings className="h-7 w-7 text-emerald-400" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize theme preferences, typography, profile details, and knowledge base backups
        </p>
      </div>

      {/* Profile Card */}
      {user && (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{user.name}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50 mt-1">
                GitHub: @{user.githubHandle || 'alexrivera-dev'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-slate-300 font-mono border-b border-slate-800 pb-3 uppercase tracking-wider">
          Appearance & Typography
        </h3>

        {/* Theme Selector */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Color Theme</h4>
            <p className="text-xs text-slate-400">Switch between dark developer mode and light theme</p>
          </div>

          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                theme === 'dark' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                theme === 'light' ? 'bg-slate-200 text-slate-950 font-bold shadow-sm' : 'text-slate-400'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Code Font Selector */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <div>
            <h4 className="text-sm font-semibold text-white">Code Editor Font</h4>
            <p className="text-xs text-slate-400">Preferred monospace font family for code blocks</p>
          </div>

          <select
            value={codeFont}
            onChange={e => setCodeFont(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-mono text-cyan-400 focus:outline-none"
          >
            <option value="jetbrains">JetBrains Mono</option>
            <option value="firacode">Fira Code</option>
            <option value="sourcecode">Source Code Pro</option>
          </select>
        </div>
      </div>

      {/* Data & Backup Settings */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-6">
        <h3 className="text-sm font-bold text-slate-300 font-mono border-b border-slate-800 pb-3 uppercase tracking-wider">
          Data & Knowledge Base Management
        </h3>

        {/* Export Data */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Export Knowledge Base</h4>
            <p className="text-xs text-slate-400">Download all notes, flows, and metadata as a standard JSON backup</p>
          </div>

          <button
            onClick={exportKnowledgeBase}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            <span>Export JSON</span>
          </button>
        </div>

        {/* Reset Mock Data */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <div>
            <h4 className="text-sm font-semibold text-rose-400">Reset Demo Data</h4>
            <p className="text-xs text-slate-400">Restore the initial MERN sample notes and flows</p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all notes and flows to initial sample data?')) {
                resetToInitialData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-900/50 bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
