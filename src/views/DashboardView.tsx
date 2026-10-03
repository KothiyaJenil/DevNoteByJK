import React from 'react';
import { useApp } from '../context/AppContext';
import { NoteCard } from '../components/notes/NoteCard';
import { FlowCard } from '../components/flows/FlowCard';
import {
  FileCode,
  GitFork,
  Star,
  Code2,
  Plus,
  ArrowRight,
  Sparkles,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { notes, flows, user, navigate } = useApp();

  const totalSnippets = notes.reduce(
    (acc, note) => acc + note.sections.reduce((sAcc, sec) => sAcc + sec.codeSnippets.length, 0),
    0
  );

  const favoriteNotes = notes.filter(n => n.isFavorite);
  const favoriteFlows = flows.filter(f => f.isFavorite);

  // Recently updated notes
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Recent flows
  const recentFlows = [...flows]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 2);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

        <div className="relative space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold font-mono border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Developer Knowledge Base</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user ? user.name : 'Developer'} 👋
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Organize technical concepts as independent <strong className="text-slate-200">Notes</strong> and connect them into meaningful <strong className="text-cyan-400">Notes Flows</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('create-note')}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Create Note</span>
            </button>

            <button
              onClick={() => navigate('create-flow')}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-cyan-400 px-4 py-2.5 text-xs font-semibold transition-colors"
            >
              <GitFork className="h-4 w-4" />
              <span>Create Notes Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Notes */}
        <div
          onClick={() => navigate('notes-list')}
          className="group rounded-2xl border border-slate-800/90 bg-[#0d1117] p-5 cursor-pointer hover:border-emerald-500/50 transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase">Total Notes</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <FileCode className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">{notes.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Technical Knowledge Objects</div>
        </div>

        {/* Notes Flows */}
        <div
          onClick={() => navigate('flows-list')}
          className="group rounded-2xl border border-slate-800/90 bg-[#0d1117] p-5 cursor-pointer hover:border-cyan-500/50 transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase">Notes Flows</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <GitFork className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">{flows.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Connected Sequences</div>
        </div>

        {/* Favorites */}
        <div
          onClick={() => navigate('favorites')}
          className="group rounded-2xl border border-slate-800/90 bg-[#0d1117] p-5 cursor-pointer hover:border-amber-500/50 transition-all shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase">Favorites</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">
            {favoriteNotes.length + favoriteFlows.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Bookmarked Items</div>
        </div>

        {/* Code Snippets */}
        <div className="group rounded-2xl border border-slate-800/90 bg-[#0d1117] p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-semibold uppercase">Code Snippets</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Code2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white mt-3 font-mono">{totalSnippets}</div>
          <div className="text-[11px] text-slate-500 mt-1">Syntax Code Blocks</div>
        </div>
      </div>

      {/* Recently Updated Notes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono">Recently Updated Notes</h2>
          </div>
          <button
            onClick={() => navigate('notes-list')}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
          >
            <span>View All ({notes.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentNotes.map(note => (
            <NoteCard key={note.id} note={note} layout="grid" />
          ))}
        </div>
      </div>

      {/* Recent Notes Flows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitFork className="h-4 w-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-mono">Connected Notes Flows</h2>
          </div>
          <button
            onClick={() => navigate('flows-list')}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
          >
            <span>View All ({flows.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentFlows.map(flow => (
            <FlowCard key={flow.id} flow={flow} />
          ))}
        </div>
      </div>
    </div>
  );
};
