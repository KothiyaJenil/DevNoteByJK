import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoteCard } from '../components/notes/NoteCard';
import { FlowCard } from '../components/flows/FlowCard';
import { Star, FileCode, GitFork } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const { notes, flows } = useApp();
  const [activeTab, setActiveTab] = useState<'notes' | 'flows'>('notes');

  const favoriteNotes = notes.filter(n => n.isFavorite);
  const favoriteFlows = flows.filter(f => f.isFavorite);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono flex items-center gap-3">
          <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
          <span>Favorites</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quick access to your bookmarked technical notes and knowledge flows
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
            activeTab === 'notes'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Favorite Notes ({favoriteNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('flows')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors ${
            activeTab === 'flows'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <GitFork className="h-4 w-4" />
          <span>Favorite Flows ({favoriteFlows.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'notes' && (
        <>
          {favoriteNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteNotes.map(note => (
                <NoteCard key={note.id} note={note} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-12 text-center text-xs text-slate-500">
              No favorite notes yet. Click the star icon on any note card to add it here.
            </div>
          )}
        </>
      )}

      {activeTab === 'flows' && (
        <>
          {favoriteFlows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favoriteFlows.map(flow => (
                <FlowCard key={flow.id} flow={flow} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-12 text-center text-xs text-slate-500">
              No favorite flows yet. Click the star icon on any flow card to add it here.
            </div>
          )}
        </>
      )}
    </div>
  );
};
