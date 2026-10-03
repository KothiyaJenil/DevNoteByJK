import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { NotesFlow, FlowNoteReference, Note } from '../../types';
import { NoteSelectorModal } from './NoteSelectorModal';
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  GitFork,
  FileText,
  Save,
  Tag,
  X,
  GripVertical,
  ExternalLink
} from 'lucide-react';

interface FlowEditorProps {
  mode: 'create' | 'edit';
  flowId?: string | null;
}

export const FlowEditor: React.FC<FlowEditorProps> = ({ mode, flowId }) => {
  const { flows, notes, addFlow, updateFlow, navigate, addToast } = useApp();

  const existingFlow = mode === 'edit' && flowId ? flows.find(f => f.id === flowId) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [flowNotes, setFlowNotes] = useState<FlowNoteReference[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    if (existingFlow) {
      setTitle(existingFlow.title);
      setDescription(existingFlow.description);
      setFlowNotes(existingFlow.notes);
      setTags(existingFlow.tags);
    } else {
      setTitle('');
      setDescription('');
      // Pre-select first 3 notes as sample if available
      setFlowNotes(
        notes.slice(0, 3).map((n, idx) => ({
          noteId: n.id,
          order: idx + 1,
          noteStepTitle: n.title,
          notesSummary: n.description
        }))
      );
      setTags(['backend', 'architecture']);
    }
  }, [flowId, existingFlow, notes]);

  const handleSelectNoteFromModal = (note: Note) => {
    setFlowNotes(prev => [
      ...prev,
      {
        noteId: note.id,
        order: prev.length + 1,
        noteStepTitle: note.title,
        notesSummary: note.description
      }
    ]);
    addToast('Note Added', `Added "${note.title}" to flow sequence`, 'info');
  };

  const handleRemoveNoteFromFlow = (noteId: string) => {
    setFlowNotes(prev =>
      prev
        .filter(fn => fn.noteId !== noteId)
        .map((fn, idx) => ({ ...fn, order: idx + 1 }))
    );
  };

  const handleMoveNote = (index: number, direction: 'up' | 'down') => {
    const newNotes = [...flowNotes];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newNotes.length) return;

    const temp = newNotes[index];
    newNotes[index] = newNotes[targetIdx];
    newNotes[targetIdx] = temp;

    // Recalculate order numbers
    setFlowNotes(newNotes.map((fn, idx) => ({ ...fn, order: idx + 1 })));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      addToast('Validation Error', 'Flow Title is required', 'error');
      return;
    }

    if (flowNotes.length === 0) {
      addToast('Validation Error', 'At least 1 Note is required in a Notes Flow', 'error');
      return;
    }

    if (mode === 'create') {
      const created = addFlow({
        title: title.trim(),
        description: description.trim(),
        notes: flowNotes,
        tags
      });
      navigate('view-flow', null, created.id);
    } else if (mode === 'edit' && flowId) {
      updateFlow(flowId, {
        title: title.trim(),
        description: description.trim(),
        notes: flowNotes,
        tags
      });
      navigate('view-flow', null, flowId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 font-sans text-slate-100">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('flows-list')}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes Flows</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Title & Description */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Notes Flow Title <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. MERN API Request Processing Flow, Auth Pipeline"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-lg font-bold text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Flow Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Explain what overall logical process or architecture sequence this flow represents..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-sm text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Sequential Notes Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <GitFork className="h-4 w-4 text-cyan-400" />
              Connected Notes Sequence ({flowNotes.length})
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Add Note to Flow</span>
              </button>
            </div>
          </div>

          {flowNotes.length > 0 ? (
            <div className="space-y-3">
              {flowNotes.map((fn, idx) => {
                const noteObj = notes.find(n => n.id === fn.noteId);

                return (
                  <div
                    key={fn.noteId}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-[#0d1117] hover:border-slate-700 transition-all shadow-md"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Step Badge */}
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-sm font-bold border border-cyan-500/30 shrink-0">
                        {idx + 1}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-100 truncate">
                          {noteObj ? noteObj.title : fn.noteStepTitle || 'Selected Note'}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {noteObj ? noteObj.description : fn.notesSummary}
                        </p>
                        {noteObj && (
                          <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-500">
                            <span>{noteObj.sections.length} Sections</span>
                            <span>•</span>
                            <span>
                              {noteObj.sections.reduce((acc, s) => acc + s.codeSnippets.length, 0)} Code Blocks
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Controls */}
                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveNote(idx, 'up')}
                        className="p-1.5 text-slate-500 hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-900"
                        title="Move step up"
                      >
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === flowNotes.length - 1}
                        onClick={() => handleMoveNote(idx, 'down')}
                        className="p-1.5 text-slate-500 hover:text-slate-200 disabled:opacity-30 rounded-lg hover:bg-slate-900"
                        title="Move step down"
                      >
                        <MoveDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveNoteFromFlow(fn.noteId)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 ml-2"
                        title="Remove from flow"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-8 text-center space-y-3">
              <FileText className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No notes added to this flow yet.</p>
              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
              >
                <Plus className="h-4 w-4" />
                <span>Select Notes to Connect</span>
              </button>
            </div>
          )}
        </div>

        {/* Tag Manager */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-cyan-400" />
            Flow Tags
          </label>

          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Tag (e.g. mern, auth, rest-api)..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Add Tag
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-900/50"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                  className="text-cyan-500 hover:text-cyan-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Note Selector Modal */}
      <NoteSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectNote={handleSelectNoteFromModal}
        selectedNoteIds={flowNotes.map(fn => fn.noteId)}
      />

      {/* Action Bar */}
      <div className="fixed bottom-[57px] md:bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-[#090d16]/95 py-2.5 sm:py-3 px-4 sm:px-6 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate('flows-list')}
            className="px-2.5 sm:px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{mode === 'create' ? 'Create Notes Flow' : 'Save Flow Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
