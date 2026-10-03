import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlowCard } from './FlowCard';
import { Search, Plus, GitFork, Sparkles } from 'lucide-react';

export const FlowsList: React.FC = () => {
  const { flows, navigate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFlows = flows.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.title.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            Notes Flows
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect existing Notes into complete logical development sequences ({flows.length})
          </p>
        </div>

        <button
          onClick={() => navigate('create-flow')}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 text-sm shadow-lg shadow-cyan-500/20 transition-all shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Create Notes Flow</span>
        </button>
      </div>

      {/* Info Banner on Flow Concept */}
      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs text-slate-300 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-cyan-300 font-mono">Core Concept: Reusable Knowledge Sequences</h4>
          <p className="text-slate-400 leading-relaxed">
            A Notes Flow contains references to your existing Notes (e.g. Route → Middleware → Controller → Service). A single Note can belong to multiple flows without content duplication!
          </p>
        </div>
      </div>

      {/* Control Bar: Search input */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-4 shadow-xl">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search flows by title, description, tags..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Flows Grid */}
      {filteredFlows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFlows.map(flow => (
            <FlowCard key={flow.id} flow={flow} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center mx-auto">
            <GitFork className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Notes Flows Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? 'No notes flows match your search query.'
              : 'Connect your existing notes into useful development sequences.'}
          </p>
          <button
            onClick={() => navigate('create-flow')}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Notes Flow</span>
          </button>
        </div>
      )}
    </div>
  );
};
