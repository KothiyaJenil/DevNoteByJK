import React from 'react';
import type { Note } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, FileCode, Code2, Tag, Edit3, ArrowRight, Layers } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  layout?: 'grid' | 'list';
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, layout = 'grid' }) => {
  const { navigate, toggleFavoriteNote, flows } = useApp();

  const totalSnippets = note.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0);
  const totalPoints = note.sections.reduce((acc, s) => acc + s.points.length, 0);

  // Check how many flows reference this note
  const usedInFlowsCount = flows.filter(f => f.notes.some(fn => fn.noteId === note.id)).length;

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  if (layout === 'list') {
    return (
      <div className="group flex items-center justify-between rounded-xl border border-slate-800/90 bg-[#0d1117]/80 p-4 hover:border-slate-700 hover:bg-slate-900 transition-all shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={e => {
              e.stopPropagation();
              toggleFavoriteNote(note.id);
            }}
            className="text-slate-600 hover:text-amber-400 p-1 transition-colors shrink-0"
          >
            <Star className={`h-4 w-4 ${note.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3
                onClick={() => navigate('view-note', note.id)}
                className="text-sm font-bold text-slate-200 hover:text-emerald-400 cursor-pointer truncate"
              >
                {note.title}
              </h3>
              {usedInFlowsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20 shrink-0">
                  {usedInFlowsCount} flow{usedInFlowsCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xl">{note.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 ml-4">
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-500">
            <span>{note.sections.length} sections</span>
            <span>•</span>
            <span>{totalSnippets} snippets</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('edit-note', note.id)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700 text-xs"
              title="Edit Note"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => navigate('view-note', note.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <span>Open</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-slate-800/90 bg-[#0d1117] p-5 hover:border-slate-700/90 hover:bg-slate-900/60 transition-all shadow-lg hover:shadow-emerald-950/20">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <FileCode className="h-4 w-4" />
            </div>
            <h3
              onClick={() => navigate('view-note', note.id)}
              className="text-base font-bold text-slate-100 hover:text-emerald-400 cursor-pointer line-clamp-1 transition-colors"
            >
              {note.title}
            </h3>
          </div>

          <button
            onClick={() => toggleFavoriteNote(note.id)}
            className="text-slate-600 hover:text-amber-400 p-1 transition-colors shrink-0"
            title={note.isFavorite ? "Unfavorite" : "Favorite"}
          >
            <Star className={`h-4.5 w-4.5 ${note.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {note.description || 'No description provided.'}
        </p>

        {/* Metrics Row */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mb-4 bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-200">{note.sections.length}</span> Sections
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <Code2 className="h-3 w-3 text-cyan-400" />
            <span className="font-semibold text-slate-200">{totalSnippets}</span> Code
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-200">{totalPoints}</span> Points
          </span>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {note.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
          {usedInFlowsCount > 0 && (
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/40 flex items-center gap-1">
              <Layers className="h-3 w-3" />
              In {usedInFlowsCount} Flow{usedInFlowsCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-mono text-[11px]">
          Updated {formatDate(note.updatedAt)}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('edit-note', note.id)}
            className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => navigate('view-note', note.id)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            <span>Open</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
