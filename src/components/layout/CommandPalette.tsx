import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Note, NotesFlow } from '../../types';
import { Search, FileCode, GitFork, Tag, ArrowRight, X, Sparkles, Code2 } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, notes, flows, navigate } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Filter Notes
  const matchingNotes = notes.filter(n => {
    if (!trimmed) return true;
    if (n.title.toLowerCase().includes(trimmed)) return true;
    if (n.description.toLowerCase().includes(trimmed)) return true;
    if (n.tags.some(t => t.toLowerCase().includes(trimmed))) return true;
    // Check section headings, points, code
    return n.sections.some(s =>
      s.heading.toLowerCase().includes(trimmed) ||
      s.points.some(p => p.toLowerCase().includes(trimmed)) ||
      s.codeSnippets.some(cs => cs.code.toLowerCase().includes(trimmed))
    );
  }).slice(0, 5);

  // Filter Flows
  const matchingFlows = flows.filter(f => {
    if (!trimmed) return true;
    if (f.title.toLowerCase().includes(trimmed)) return true;
    if (f.description.toLowerCase().includes(trimmed)) return true;
    return f.tags.some(t => t.toLowerCase().includes(trimmed));
  }).slice(0, 3);

  const handleSelectNote = (id: string) => {
    setIsSearchOpen(false);
    navigate('view-note', id);
  };

  const handleSelectFlow = (id: string) => {
    setIsSearchOpen(false);
    navigate('view-flow', null, id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl shadow-emerald-950/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3 bg-slate-900/90">
          <Search className="h-5 w-5 text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search developer notes, code snippets, flows, tags..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="ml-2 rounded-md bg-slate-800 px-2 py-1 text-xs font-mono text-slate-400 hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Notes Section */}
          {matchingNotes.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Developer Notes ({matchingNotes.length})
              </div>
              <div className="mt-1 space-y-1">
                {matchingNotes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => handleSelectNote(note.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                        <FileCode className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                          {note.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{note.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                            {note.sections.length} sections
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                            {note.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0)} snippets
                          </span>
                          {note.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/40">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Flows Section */}
          {matchingFlows.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Notes Flows ({matchingFlows.length})
              </div>
              <div className="mt-1 space-y-1">
                {matchingFlows.map(flow => (
                  <button
                    key={flow.id}
                    onClick={() => handleSelectFlow(flow.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="mt-0.5 rounded-lg bg-cyan-500/10 p-2 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                        <GitFork className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                          {flow.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{flow.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-[11px] font-mono text-cyan-400">
                          <span>{flow.notes.length} Connected Notes</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingNotes.length === 0 && matchingFlows.length === 0 && (
            <div className="p-8 text-center">
              <Code2 className="h-10 w-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No matching knowledge found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for express, middleware, route, or zod</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-4 py-2 text-xs text-slate-500 font-mono">
          <span>Tip: Press ESC to close</span>
          <span className="text-emerald-400">DevNotes Palette</span>
        </div>
      </div>
    </div>
  );
};
