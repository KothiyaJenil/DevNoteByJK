import React, { useState } from 'react';
import { ArrowRight, Layers, Check, GitCommit, FileText, ChevronRight } from 'lucide-react';

export const HeroDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const heroNotes = [
    { id: 1, title: 'Express Route', tag: '#routing', snippets: 1, sections: 2 },
    { id: 2, title: 'JWT Authentication', tag: '#security', snippets: 1, sections: 2 },
    { id: 3, title: 'Request Validation', tag: '#zod', snippets: 2, sections: 1 },
    { id: 4, title: 'User Controller', tag: '#controller', snippets: 1, sections: 2 },
    { id: 5, title: 'User Service', tag: '#service', snippets: 1, sections: 1 },
    { id: 6, title: 'Mongoose Schema', tag: '#database', snippets: 1, sections: 1 },
    { id: 7, title: 'Error Handler', tag: '#middleware', snippets: 1, sections: 1 }
  ];

  const flowNodes = [
    { step: 1, name: 'Express Route', noteId: 1 },
    { step: 2, name: 'Auth Middleware', noteId: 2 },
    { step: 3, name: 'Request Validation', noteId: 3 },
    { step: 4, name: 'Controller Layer', noteId: 4 },
    { step: 5, name: 'Business Service', noteId: 5 },
    { step: 6, name: 'Mongoose Model', noteId: 6 }
  ];

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#0d1117]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl glow-emerald overflow-hidden">
      {/* Subtle Grid background lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Top Header */}
      <div className="relative flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-amber-500/80"></span>
            <span className="h-3 w-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="ml-2 font-mono text-xs text-slate-400">devnotes-workspace // mern-architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-mono text-emerald-400 font-semibold">Live Interactive Diagram</span>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Individual Notes */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Independent Notes</h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Reusable Objects</span>
          </div>

          <div className="space-y-2.5">
            {heroNotes.map(note => {
              const isConnected = flowNodes.some(f => f.noteId === note.id);
              const isHovered = activeStep === note.id;

              return (
                <div
                  key={note.id}
                  onMouseEnter={() => setActiveStep(note.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'border-emerald-500 bg-slate-800/90 shadow-lg shadow-emerald-950/40 translate-x-1'
                      : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isHovered ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200 font-mono group-hover:text-emerald-300">
                        {note.title}
                      </h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-emerald-400/90 font-mono">{note.tag}</span>
                        <span className="text-[10px] text-slate-500">• {note.snippets} code snippet</span>
                      </div>
                    </div>
                  </div>

                  {isConnected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                      In Flow
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Connection Indicator */}
        <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center h-full space-y-3 pt-12">
          <div className="h-12 w-px bg-gradient-to-b from-emerald-500 via-cyan-500 to-transparent"></div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold shadow-lg shadow-emerald-500/10">
            <ArrowRight className="h-5 w-5 animate-pulse" />
          </div>
          <div className="text-[10px] text-center font-mono text-slate-400">
            Sequence References
          </div>
          <div className="h-12 w-px bg-gradient-to-b from-cyan-500 to-emerald-500"></div>
        </div>

        {/* Right Column: Connected Notes Flow */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">Notes Flow</h4>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-semibold">MERN API Sequence</span>
          </div>

          <div className="relative space-y-2 p-3 rounded-xl border border-cyan-500/20 bg-slate-900/40">
            {flowNodes.map((fn, idx) => {
              const isHighlight = activeStep === fn.noteId;

              return (
                <React.Fragment key={fn.step}>
                  <div
                    onMouseEnter={() => setActiveStep(fn.noteId)}
                    onMouseLeave={() => setActiveStep(null)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isHighlight
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/30 scale-[1.02]'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                        {fn.step}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 font-mono">
                        {fn.name}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      Note #{fn.noteId}
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>

                  {idx < flowNodes.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <div className="h-3 w-0.5 bg-gradient-to-b from-cyan-400/80 to-slate-700"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <span className="text-slate-300 font-semibold">
          💡 A Notes Flow contains references to existing Notes. No code duplication!
        </span>
        <span className="text-emerald-400">DevNotes Design Architecture</span>
      </div>
    </div>
  );
};
