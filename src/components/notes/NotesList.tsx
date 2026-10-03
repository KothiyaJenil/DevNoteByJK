import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NoteCard } from './NoteCard';
import { Search, Plus, LayoutGrid, List, SlidersHorizontal, FileCode, Tag, ArrowUpDown } from 'lucide-react';

export const NotesList: React.FC = () => {
  const { notes, navigate, activeTagFilter } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(activeTagFilter);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'snippets'>('updated');

  // Extract unique user tags across all notes
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.sections.some(s => s.heading.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || n.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'snippets') {
      const snippetsA = a.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0);
      const snippetsB = b.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0);
      return snippetsB - snippetsA;
    }
    // Default 'updated'
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            Developer Notes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and manage your individual technical knowledge notes ({notes.length})
          </p>
        </div>

        <button
          onClick={() => navigate('create-note')}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 text-sm shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Create Note</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters, Sort, View Toggle */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter notes by title, code snippet, section heading..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="updated">Recently Updated</option>
                <option value="title">Title (A-Z)</option>
                <option value="snippets">Most Snippets</option>
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewLayout('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === 'list' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tag Filter Pills */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/60 pb-1 scrollbar-none">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tags:
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-colors shrink-0 ${
                selectedTag === null
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Notes
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-colors shrink-0 ${
                  selectedTag === tag
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-emerald-300 border border-slate-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid or List Display */}
      {sortedNotes.length > 0 ? (
        <div
          className={
            viewLayout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-3'
          }
        >
          {sortedNotes.map(note => (
            <NoteCard key={note.id} note={note} layout={viewLayout} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-600 flex items-center justify-center mx-auto">
            <FileCode className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Notes Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedTag
              ? 'No technical notes matched your search query or tag filter.'
              : 'Start building your personal developer knowledge base by writing your first note.'}
          </p>
          <button
            onClick={() => navigate('create-note')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-lg shadow-emerald-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Note Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
