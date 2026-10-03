import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoteCard } from '../components/notes/NoteCard';
import { Tag as TagIcon, FileCode } from 'lucide-react';

export const TagsView: React.FC = () => {
  const { notes, activeTagFilter } = useApp();
  const [selectedTag, setSelectedTag] = useState<string | null>(activeTagFilter);

  // Group tags with count
  const tagCounts: { [key: string]: number } = {};
  notes.forEach(note => {
    note.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  const filteredNotes = selectedTag
    ? notes.filter(n => n.tags.includes(selectedTag))
    : notes;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono flex items-center gap-3">
          <TagIcon className="h-7 w-7 text-cyan-400" />
          <span>Tags & Topics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore technical notes by developer-defined topic tags ({sortedTags.length} Unique Tags)
        </p>
      </div>

      {/* Tag Cloud Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-3">
        <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
          Filter Knowledge by Tag
        </h3>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-xs px-3 py-1.5 rounded-xl font-mono transition-colors ${
              selectedTag === null
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All Tags ({notes.length})
          </button>

          {sortedTags.map(([tag, count]) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-xl font-mono transition-colors flex items-center gap-1.5 ${
                selectedTag === tag
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:text-cyan-300 border border-slate-800'
              }`}
            >
              <span>#{tag}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Notes Output */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-300 font-mono">
          {selectedTag ? `Notes Tagged with #${selectedTag} (${filteredNotes.length})` : `All Notes (${filteredNotes.length})`}
        </h3>

        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard key={note.id} note={note} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-12 text-center text-xs text-slate-500">
            No notes found with tag #{selectedTag}.
          </div>
        )}
      </div>
    </div>
  );
};
