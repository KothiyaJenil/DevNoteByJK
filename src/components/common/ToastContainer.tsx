import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
      {toasts.map(toast => {
        const iconMap = {
          success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
          info: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
          warning: <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />,
          error: <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
        };

        const borderMap = {
          success: 'border-emerald-500/40 bg-slate-900/95 text-slate-100 shadow-emerald-950/20',
          info: 'border-cyan-500/40 bg-slate-900/95 text-slate-100 shadow-cyan-950/20',
          warning: 'border-amber-500/40 bg-slate-900/95 text-slate-100 shadow-amber-950/20',
          error: 'border-rose-500/40 bg-slate-900/95 text-slate-100 shadow-rose-950/20'
        };

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 ${borderMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
              {toast.message && (
                <p className="mt-0.5 text-xs text-slate-400 truncate">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
