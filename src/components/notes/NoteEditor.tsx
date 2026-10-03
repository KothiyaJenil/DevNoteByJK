import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Note, NoteSection, CodeSnippet, ReferenceLink } from '../../types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Code2,
  ListPlus,
  FileCode,
  Tag,
  Link,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  GripVertical
} from 'lucide-react';

interface NoteEditorProps {
  mode: 'create' | 'edit';
  noteId?: string | null;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ mode, noteId }) => {
  const { notes, addNote, updateNote, navigate, addToast } = useApp();

  const existingNote = mode === 'edit' && noteId ? notes.find(n => n.id === noteId) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState<NoteSection[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [references, setReferences] = useState<ReferenceLink[]>([]);
  const [refTitle, setRefTitle] = useState('');
  const [refUrl, setRefUrl] = useState('');

  const [isDirty, setIsDirty] = useState(false);

  // Initialize fields
  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setDescription(existingNote.description);
      setSections(existingNote.sections);
      setTags(existingNote.tags);
      setReferences(existingNote.references);
    } else {
      // Default blank note structure with 1 initial section
      setTitle('');
      setDescription('');
      setSections([
        {
          id: `sec-${Date.now()}`,
          heading: 'Overview & Concept',
          explanation: '',
          points: [''],
          codeSnippets: []
        }
      ]);
      setTags(['javascript', 'backend']);
      setReferences([]);
    }
  }, [noteId, existingNote]);

  const markDirty = () => setIsDirty(true);

  // Section Management
  const handleAddSection = () => {
    markDirty();
    setSections(prev => [
      ...prev,
      {
        id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        heading: '',
        explanation: '',
        points: [''],
        codeSnippets: []
      }
    ]);
  };

  const handleRemoveSection = (sectionId: string) => {
    markDirty();
    setSections(prev => prev.filter(s => s.id !== sectionId));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    markDirty();
    const newSections = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    setSections(newSections);
  };

  // Section Heading & Explanation
  const handleUpdateSectionField = (sectionId: string, field: 'heading' | 'explanation', value: string) => {
    markDirty();
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, [field]: value } : s))
    );
  };

  // Points Management
  const handleAddPoint = (sectionId: string) => {
    markDirty();
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, points: [...s.points, ''] } : s))
    );
  };

  const handleUpdatePoint = (sectionId: string, pointIndex: number, value: string) => {
    markDirty();
    setSections(prev =>
      prev.map(s => {
        if (s.id === sectionId) {
          const updatedPoints = [...s.points];
          updatedPoints[pointIndex] = value;
          return { ...s, points: updatedPoints };
        }
        return s;
      })
    );
  };

  const handleRemovePoint = (sectionId: string, pointIndex: number) => {
    markDirty();
    setSections(prev =>
      prev.map(s => {
        if (s.id === sectionId) {
          return { ...s, points: s.points.filter((_, idx) => idx !== pointIndex) };
        }
        return s;
      })
    );
  };

  // Code Snippets Management
  const handleAddCodeSnippet = (sectionId: string) => {
    markDirty();
    const newSnippet: CodeSnippet = {
      id: `snip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      language: 'javascript',
      title: '',
      code: ''
    };
    setSections(prev =>
      prev.map(s => (s.id === sectionId ? { ...s, codeSnippets: [...s.codeSnippets, newSnippet] } : s))
    );
  };

  const handleUpdateSnippet = (
    sectionId: string,
    snippetId: string,
    field: 'language' | 'title' | 'code',
    value: string
  ) => {
    markDirty();
    setSections(prev =>
      prev.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            codeSnippets: s.codeSnippets.map(cs =>
              cs.id === snippetId ? { ...cs, [field]: value } : cs
            )
          };
        }
        return s;
      })
    );
  };

  const handleRemoveSnippet = (sectionId: string, snippetId: string) => {
    markDirty();
    setSections(prev =>
      prev.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            codeSnippets: s.codeSnippets.filter(cs => cs.id !== snippetId)
          };
        }
        return s;
      })
    );
  };

  // Tag Management
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      markDirty();
      setTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    markDirty();
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Reference Management
  const handleAddReference = () => {
    if (refTitle.trim() && refUrl.trim()) {
      markDirty();
      setReferences(prev => [
        ...prev,
        { id: `ref-${Date.now()}`, title: refTitle.trim(), url: refUrl.trim() }
      ]);
      setRefTitle('');
      setRefUrl('');
    }
  };

  const handleRemoveReference = (refId: string) => {
    markDirty();
    setReferences(prev => prev.filter(r => r.id !== refId));
  };

  // Submit Handler
  const handleSave = (isDraft = false) => {
    if (!title.trim()) {
      addToast('Validation Error', 'Note Title is required', 'error');
      return;
    }

    // Clean blank points/sections
    const cleanedSections = sections.map(s => ({
      ...s,
      points: s.points.filter(p => p.trim() !== ''),
      codeSnippets: s.codeSnippets.filter(cs => cs.code.trim() !== '')
    })).filter(s => s.heading.trim() !== '' || s.points.length > 0 || s.codeSnippets.length > 0);

    if (mode === 'create') {
      const created = addNote({
        title: title.trim(),
        description: description.trim(),
        sections: cleanedSections.length > 0 ? cleanedSections : sections,
        tags,
        references
      });
      setIsDirty(false);
      navigate('view-note', created.id);
    } else if (mode === 'edit' && noteId) {
      updateNote(noteId, {
        title: title.trim(),
        description: description.trim(),
        sections: cleanedSections.length > 0 ? cleanedSections : sections,
        tags,
        references
      });
      setIsDirty(false);
      navigate('view-note', noteId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 font-sans text-slate-100">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            if (isDirty && !window.confirm('You have unsaved changes. Discard and return?')) return;
            navigate('notes-list');
          }}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </button>

        {isDirty && (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-950/40 px-3 py-1 rounded-full border border-amber-800/50">
            <AlertCircle className="h-3.5 w-3.5" />
            Unsaved changes
          </span>
        )}
      </div>

      <div className="space-y-8">
        {/* Title & Description Block */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Note Title <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                markDirty();
              }}
              placeholder="e.g. Express Middleware Pattern, JWT Auth Pipeline, Zod Schema Validation"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-lg font-bold text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Short Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                markDirty();
              }}
              placeholder="Brief summary of what this technical knowledge covers..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3 text-sm text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Sections Block */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <FileCode className="h-4 w-4 text-emerald-400" />
              Dynamic Content Sections ({sections.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">Add points, headings & code snippets freely</span>
          </div>

          {sections.map((section, sIdx) => (
            <div
              key={section.id}
              className="group relative rounded-2xl border border-slate-800 bg-[#0d1117] p-6 shadow-xl space-y-6 transition-all hover:border-slate-700"
            >
              {/* Section Header Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                    {sIdx + 1}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400">Section {sIdx + 1}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={sIdx === 0}
                    onClick={() => handleMoveSection(sIdx, 'up')}
                    className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-30"
                    title="Move section up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={sIdx === sections.length - 1}
                    onClick={() => handleMoveSection(sIdx, 'down')}
                    className="p-1 text-slate-500 hover:text-slate-200 disabled:opacity-30"
                    title="Move section down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(section.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 ml-2"
                    title="Delete section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Heading / Title</label>
                <input
                  type="text"
                  value={section.heading}
                  onChange={e => handleUpdateSectionField(section.id, 'heading', e.target.value)}
                  placeholder="e.g. What is Middleware? or Implementation Pattern"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-sm font-semibold text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Explanation (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Explanation (Optional)</label>
                <textarea
                  rows={2}
                  value={section.explanation || ''}
                  onChange={e => handleUpdateSectionField(section.id, 'explanation', e.target.value)}
                  placeholder="Conceptual explanation or contextual details..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Key Bullet Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <ListPlus className="h-3.5 w-3.5 text-emerald-400" />
                    Bullet Points ({section.points.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddPoint(section.id)}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {section.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-xs">•</span>
                      <input
                        type="text"
                        value={pt}
                        onChange={e => handleUpdatePoint(section.id, pIdx, e.target.value)}
                        placeholder="Key takeaway or point..."
                        className="flex-1 rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(section.id, pIdx)}
                        className="text-slate-600 hover:text-rose-400 p-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippets under Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                    Code Snippets ({section.codeSnippets.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddCodeSnippet(section.id)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Code Snippet</span>
                  </button>
                </div>

                {section.codeSnippets.map((cs, cIdx) => (
                  <div key={cs.id} className="rounded-xl border border-slate-800 bg-[#080b12] p-3 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={cs.title || ''}
                          onChange={e => handleUpdateSnippet(section.id, cs.id, 'title', e.target.value)}
                          placeholder="Filename (e.g. middleware/auth.js)"
                          className="flex-1 rounded-md border border-slate-800 bg-slate-900 p-1.5 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                        />
                        <select
                          value={cs.language}
                          onChange={e => handleUpdateSnippet(section.id, cs.id, 'language', e.target.value)}
                          className="rounded-md border border-slate-800 bg-slate-900 p-1.5 text-xs font-mono text-cyan-400 focus:outline-none"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="python">Python</option>
                          <option value="sql">SQL</option>
                          <option value="bash">Bash / Shell</option>
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="json">JSON</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSnippet(section.id, cs.id)}
                        className="text-slate-600 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      value={cs.code}
                      onChange={e => handleUpdateSnippet(section.id, cs.id, 'code', e.target.value)}
                      placeholder="// Write code snippet here..."
                      className="w-full rounded-lg border border-slate-800/80 bg-[#0d1117] p-3 font-mono text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Add Section Trigger */}
          <button
            type="button"
            onClick={handleAddSection}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/30 hover:bg-slate-900/60 p-4 text-sm font-semibold text-emerald-400 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Content Section</span>
          </button>
        </div>

        {/* Tags & References Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tag Manager */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-emerald-400" />
              Tags & Topics
            </label>

            <div className="flex gap-2">
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
                placeholder="Type tag (e.g. express) and press enter"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
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
                  className="flex items-center gap-1.5 text-xs font-mono text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-900/50"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-emerald-500 hover:text-emerald-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Reference Links Manager */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d1117] p-5 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Link className="h-3.5 w-3.5 text-cyan-400" />
              Documentation & References
            </label>

            <div className="space-y-2">
              <input
                type="text"
                value={refTitle}
                onChange={e => setRefTitle(e.target.value)}
                placeholder="Link Title (e.g. Express Routing Docs)"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="url"
                  value={refUrl}
                  onChange={e => setRefUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddReference}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Add Link
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              {references.map(ref => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-lg border border-slate-800"
                >
                  <span className="text-cyan-400 truncate">{ref.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveReference(ref.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-[57px] md:bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-[#090d16]/95 py-2.5 sm:py-3 px-4 sm:px-6 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate('notes-list')}
            className="px-2.5 sm:px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-3 sm:px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>{mode === 'create' ? 'Create Note' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
