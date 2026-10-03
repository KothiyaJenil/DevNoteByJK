import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Note } from '../../types';
import { CodeBlock } from '../common/CodeBlock';
import {
  ArrowLeft,
  Star,
  Edit3,
  Trash2,
  GitFork,
  FileText,
  ChevronRight,
  ArrowDown,
  ExternalLink,
  Layers,
  X,
  Code2
} from 'lucide-react';

interface FlowDetailProps {
  flowId: string | null;
}

export const FlowDetail: React.FC<FlowDetailProps> = ({ flowId }) => {
  const { flows, notes, navigate, toggleFavoriteFlow, deleteFlow } = useApp();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const flow = flows.find(f => f.id === flowId);

  if (!flow) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 font-sans">
        <GitFork className="h-12 w-12 text-slate-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Notes Flow Not Found</h2>
        <p className="text-xs text-slate-400">The requested flow sequence doesn't exist or was deleted.</p>
        <button
          onClick={() => navigate('flows-list')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes Flows</span>
        </button>
      </div>
    );
  }

  // Hydrate notes list from references
  const hydratedNotes = flow.notes
    .map(fn => ({
      order: fn.order,
      noteStepTitle: fn.noteStepTitle,
      note: notes.find(n => n.id === fn.noteId)
    }))
    .filter(item => item.note !== undefined);

  return (
    <div className="max-w-6xl mx-auto pb-20 font-sans text-slate-100">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('flows-list')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes Flows</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavoriteFlow(flow.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              flow.isFavorite
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`h-4 w-4 ${flow.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{flow.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={() => navigate('edit-flow', null, flow.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Edit3 className="h-4 w-4 text-cyan-400" />
            <span>Edit Flow</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-500 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
            title="Delete Flow"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Flow Information Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GitFork className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{flow.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
                {flow.notes.length} Connected Notes Sequence
              </span>
              {flow.tags.map(tag => (
                <span key={tag} className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {flow.description && (
          <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
            {flow.description}
          </p>
        )}
      </div>

      {/* Interactive Visual Node Diagram */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            Interactive Flowchart Nodes
          </h2>
          <span className="text-xs text-slate-500 font-mono">Click any note node to inspect details</span>
        </div>

        <div className="relative space-y-4 p-6 sm:p-8 rounded-2xl border border-cyan-500/20 bg-slate-900/30 backdrop-blur-md">
          {hydratedNotes.map((item, idx) => {
            const noteObj = item.note!;
            const totalSnippets = noteObj.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0);

            return (
              <React.Fragment key={noteObj.id}>
                {/* Flow Node Card */}
                <div
                  onClick={() => setSelectedNote(noteObj)}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-slate-800 bg-[#0d1117] hover:border-cyan-400 hover:bg-slate-900/90 transition-all cursor-pointer shadow-lg hover:shadow-cyan-950/30 gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-sm font-extrabold border border-cyan-500/30 shrink-0">
                      {idx + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 truncate">
                          {noteObj.title}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                          Referenced Note
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-1">{noteObj.description}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-slate-500">
                        <span>{noteObj.sections.length} Sections</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Code2 className="h-3 w-3 text-cyan-400" />
                          {totalSnippets} Code Snippets
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigate('view-note', noteObj.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                    >
                      <span>Full Note</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < hydratedNotes.length - 1 && (
                  <div className="flex flex-col items-center justify-center my-2">
                    <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-400 via-cyan-500 to-slate-700"></div>
                    <ArrowDown className="h-5 w-5 text-cyan-400 animate-flow-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Note Inspection Side Drawer Modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-full overflow-y-auto bg-[#0d1117] border-l border-slate-800 p-4 sm:p-6 pb-20 sm:pb-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Flow Note Inspection
                </span>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="text-slate-500 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">{selectedNote.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                {selectedNote.description}
              </p>

              {/* Sections list preview */}
              <div className="space-y-6 pt-4">
                {selectedNote.sections.map((s, idx) => (
                  <div key={s.id} className="space-y-3">
                    <h4 className="text-sm font-bold text-cyan-300 font-mono">
                      {idx + 1}. {s.heading}
                    </h4>
                    {s.explanation && (
                      <p className="text-xs text-slate-400">{s.explanation}</p>
                    )}
                    {s.points.map((p, pIdx) => (
                      <div key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </div>
                    ))}
                    {s.codeSnippets.map(cs => (
                      <CodeBlock key={cs.id} code={cs.code} language={cs.language} title={cs.title} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedNote(null);
                  navigate('view-note', selectedNote.id);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                <span>Open Dedicated Note View</span>
                <ExternalLink className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedNote(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Notes Flow?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{flow.title}"</strong>? Individual referenced Notes will NOT be deleted.
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
                  deleteFlow(flow.id);
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs"
              >
                Delete Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
