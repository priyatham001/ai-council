import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description?: string;
}

// Global emitter event
export const showToast = (toast: Omit<ToastMessage, 'id'>) => {
  const event = new CustomEvent('smartagrilink_toast', {
    detail: { ...toast, id: `toast-${Date.now()}` }
  });
  window.dispatchEvent(event);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const newToast: ToastMessage = e.detail;
      setToasts((prev) => [newToast, ...prev].slice(0, 4));

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('smartagrilink_toast', handleToast);
    return () => window.removeEventListener('smartagrilink_toast', handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start gap-3 bg-white transition-all transform animate-slideUp ${
            toast.type === 'success'
              ? 'border-emerald-200 text-emerald-950'
              : toast.type === 'warning'
              ? 'border-amber-200 text-amber-950'
              : 'border-blue-200 text-blue-950'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 leading-snug">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-700 hover:text-gray-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
