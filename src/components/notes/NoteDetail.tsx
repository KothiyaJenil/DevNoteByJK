import React, { useState } from 'react';
import type { Note } from '../../types';
import { useApp } from '../../context/AppContext';
import { CodeBlock } from '../common/CodeBlock';
import {
  ArrowLeft,
  Star,
  Edit3,
  Trash2,
  Tag,
  ExternalLink,
  Layers,
  List,
  CheckCircle2,
  FileCode,
  ArrowRight
} from 'lucide-react';

interface NoteDetailProps {
  noteId: string | null;
}

export const NoteDetail: React.FC<NoteDetailProps> = ({ noteId }) => {
  const { notes, flows, navigate, toggleFavoriteNote, deleteNote } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const note = notes.find(n => n.id === noteId);

  if (!note) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <FileCode className="h-12 w-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Note Not Found</h2>
        <p className="text-xs text-slate-400">The requested note doesn't exist or was removed.</p>
        <button
          onClick={() => navigate('notes-list')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </button>
      </div>
    );
  }

  // Find which flows include this Note
  const connectedFlows = flows.filter(f => f.notes.some(fn => fn.noteId === note.id));

  return (
    <div className="max-w-6xl mx-auto pb-20 font-sans text-slate-100">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('notes-list')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavoriteNote(note.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              note.isFavorite
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`h-4 w-4 ${note.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{note.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={() => navigate('edit-note', note.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Edit3 className="h-4 w-4 text-emerald-400" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-500 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
            title="Delete Note"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Reading Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Note Banner */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {note.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-900/50">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {note.title}
            </h1>

            {note.description && (
              <p className="text-sm text-slate-300 leading-relaxed pt-1 border-t border-slate-800/60">
                {note.description}
              </p>
            )}
          </div>

          {/* Connected Flows Panel */}
          {connectedFlows.length > 0 && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
                <Layers className="h-4 w-4 text-cyan-400" />
                Used in Notes Flows ({connectedFlows.length})
              </div>
              <p className="text-xs text-slate-400">
                This note is referenced inside the following connected development flows:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {connectedFlows.map(flow => (
                  <button
                    key={flow.id}
                    onClick={() => navigate('view-flow', null, flow.id)}
                    className="flex items-center justify-between p-3 rounded-xl border border-cyan-800/40 bg-slate-900/90 hover:border-cyan-400 transition-all group text-left"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                        {flow.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {flow.notes.length} Sequential Steps
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Content Sections */}
          <div className="space-y-8">
            {note.sections.map((section, sIdx) => (
              <section key={section.id} id={`sec-${sIdx}`} className="space-y-4 scroll-mt-20">
                <div className="border-b border-slate-800 pb-2 flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                    {sIdx + 1}
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {section.heading}
                  </h2>
                </div>

                {section.explanation && (
                  <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
                    {section.explanation}
                  </p>
                )}

                {/* Points */}
                {section.points.length > 0 && (
                  <ul className="space-y-2 pl-2">
                    {section.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Code Snippets */}
                {section.codeSnippets.map(cs => (
                  <CodeBlock
                    key={cs.id}
                    code={cs.code}
                    language={cs.language}
                    title={cs.title}
                  />
                ))}
              </section>
            ))}
          </div>

          {/* Reference Links */}
          {note.references && note.references.length > 0 && (
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
                External References & Documentation
              </h3>
              <div className="flex flex-wrap gap-3">
                {note.references.map(ref => (
                  <a
                    key={ref.id}
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800 transition-colors"
                  >
                    <span>{ref.title}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Table of Contents & Info */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Table of Contents */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
              <List className="h-4 w-4 text-emerald-400" />
              Table of Contents
            </div>
            <nav className="space-y-1">
              {note.sections.map((s, idx) => (
                <a
                  key={s.id}
                  href={`#sec-${idx}`}
                  className="block px-2.5 py-1.5 text-xs text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-lg transition-colors truncate"
                >
                  {idx + 1}. {s.heading}
                </a>
              ))}
            </nav>
          </div>

          {/* Knowledge Metadata Card */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5 space-y-3 text-xs text-slate-400 font-mono">
            <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
              Metadata
            </div>
            <div className="flex justify-between">
              <span>Sections:</span>
              <span className="text-slate-200">{note.sections.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Code Blocks:</span>
              <span className="text-slate-200">
                {note.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last Modified:</span>
              <span className="text-slate-200">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Note?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{note.title}"</strong>? This will remove it from all connected Notes Flows.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteNote(note.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
