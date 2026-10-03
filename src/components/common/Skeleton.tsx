import React from 'react';

export const NoteCardSkeleton: React.FC = () => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse">
    <div className="flex justify-between items-start gap-4">
      <div className="h-6 bg-slate-800 rounded w-3/4 mb-3"></div>
      <div className="h-5 w-5 bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-4 bg-slate-800/60 rounded w-full mb-2"></div>
    <div className="h-4 bg-slate-800/60 rounded w-2/3 mb-4"></div>
    
    <div className="flex gap-4 mb-4">
      <div className="h-5 w-20 bg-slate-800/80 rounded-md"></div>
      <div className="h-5 w-24 bg-slate-800/80 rounded-md"></div>
    </div>

    <div className="flex gap-2 mb-4">
      <div className="h-6 w-16 bg-slate-800/50 rounded-full"></div>
      <div className="h-6 w-16 bg-slate-800/50 rounded-full"></div>
      <div className="h-6 w-16 bg-slate-800/50 rounded-full"></div>
    </div>

    <div className="pt-3 border-t border-slate-800/50 flex justify-between items-center">
      <div className="h-3 w-28 bg-slate-800/60 rounded"></div>
      <div className="h-8 w-20 bg-slate-800 rounded-lg"></div>
    </div>
  </div>
);

export const NoteDetailSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
    <div className="h-4 w-32 bg-slate-800 rounded"></div>
    <div className="h-10 w-2/3 bg-slate-800 rounded-lg"></div>
    <div className="h-5 w-full bg-slate-800/50 rounded"></div>
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
      <div className="h-6 w-20 bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-px bg-slate-800 my-6"></div>
    
    <div className="space-y-4">
      <div className="h-7 w-48 bg-slate-800 rounded"></div>
      <div className="h-4 w-full bg-slate-800/50 rounded"></div>
      <div className="h-4 w-5/6 bg-slate-800/50 rounded"></div>
      <div className="h-48 w-full bg-slate-800/80 rounded-xl"></div>
    </div>
  </div>
);

export const FlowCardSkeleton: React.FC = () => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 animate-pulse">
    <div className="h-6 w-1/2 bg-slate-800 rounded mb-3"></div>
    <div className="h-4 w-5/6 bg-slate-800/60 rounded mb-5"></div>
    <div className="flex items-center gap-2 mb-6">
      <div className="h-8 w-28 bg-slate-800 rounded-lg"></div>
      <div className="h-4 w-4 bg-slate-800 rounded"></div>
      <div className="h-8 w-28 bg-slate-800 rounded-lg"></div>
      <div className="h-4 w-4 bg-slate-800 rounded"></div>
      <div className="h-8 w-28 bg-slate-800 rounded-lg"></div>
    </div>
    <div className="h-4 w-32 bg-slate-800/50 rounded"></div>
  </div>
);
