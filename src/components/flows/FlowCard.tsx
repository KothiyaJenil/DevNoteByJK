import React from 'react';
import type { NotesFlow } from '../../types';
import { useApp } from '../../context/AppContext';
import { GitFork, Star, ArrowRight, Layers, ChevronRight, FileText } from 'lucide-react';

interface FlowCardProps {
  flow: NotesFlow;
}

export const FlowCard: React.FC<FlowCardProps> = ({ flow }) => {
  const { notes, navigate, toggleFavoriteFlow } = useApp();

  // Map note IDs to actual Note objects
  const flowNotesList = flow.notes
    .map(fn => notes.find(n => n.id === fn.noteId))
    .filter(Boolean);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0d1117] p-6 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all shadow-lg hover:shadow-cyan-950/20">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <GitFork className="h-4 w-4" />
            </div>
            <h3
              onClick={() => navigate('view-flow', null, flow.id)}
              className="text-base font-bold text-slate-100 hover:text-cyan-400 cursor-pointer line-clamp-1 transition-colors"
            >
              {flow.title}
            </h3>
          </div>

          <button
            onClick={() => toggleFavoriteFlow(flow.id)}
            className="text-slate-600 hover:text-amber-400 p-1 transition-colors shrink-0"
            title={flow.isFavorite ? "Unfavorite Flow" : "Favorite Flow"}
          >
            <Star className={`h-4.5 w-4.5 ${flow.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {flow.description || 'No description provided.'}
        </p>

        {/* Sequential Step Pills Preview */}
        <div className="mb-6 space-y-1.5">
          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>SEQUENCE ({flow.notes.length} NOTES)</span>
            <span className="text-cyan-400 font-semibold">Flowchart</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
            {flowNotesList.slice(0, 5).map((n, idx) => (
              <React.Fragment key={n?.id || idx}>
                <span className="text-xs font-mono font-medium text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/60 truncate max-w-[140px]">
                  {n?.title || 'Note'}
                </span>
                {idx < Math.min(flowNotesList.length, 5) - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
            {flowNotesList.length > 5 && (
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                +{flowNotesList.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {flow.tags.map(tag => (
            <span key={tag} className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/40">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-mono text-[11px]">
          Updated {formatDate(flow.updatedAt)}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('edit-flow', null, flow.id)}
            className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => navigate('view-flow', null, flow.id)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors"
          >
            <span>View Flow</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
