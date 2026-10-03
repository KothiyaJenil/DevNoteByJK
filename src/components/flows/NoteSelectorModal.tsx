import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Note } from '../../types';
import { Search, Plus, FileCode, Check, X, Code2 } from 'lucide-react';

interface NoteSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (note: Note) => void;
  selectedNoteIds: string[];
}

export const NoteSelectorModal: React.FC<NoteSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectNote,
  selectedNoteIds
}) => {
  const { notes, navigate } = useApp();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredNotes = notes.filter(n => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl space-y-4 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white">Add Existing Note to Flow</h3>
            <p className="text-xs text-slate-400">Search and select notes from your knowledge base</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar & Create New Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search your notes by title or tags..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => {
              onClose();
              navigate('create-note');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 border border-slate-700 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Note</span>
          </button>
        </div>

        {/* Note List Options */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => {
              const isAdded = selectedNoteIds.includes(note.id);
              const snippetCount = note.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0);

              return (
                <div
                  key={note.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isAdded
                      ? 'border-cyan-500/40 bg-cyan-950/20 opacity-70'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800 text-cyan-400 mt-0.5 shrink-0">
                      <FileCode className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">{note.title}</h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{note.description}</p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {note.sections.length} Sections
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {snippetCount} Code Snippets
                        </span>
                        {note.tags.map(t => (
                          <span key={t} className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isAdded}
                    onClick={() => onSelectNote(note)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 ml-3 transition-colors ${
                      isAdded
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add to Flow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No notes match "{query}". Try creating a new note first.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>{selectedNoteIds.length} Notes selected</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
