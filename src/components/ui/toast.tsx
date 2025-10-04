"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Toast = { id: number; title?: string; description?: string };

const ToastContext = createContext<{
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  remove: (id: number) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = (t: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => remove(id), 3000);
  };
  const remove = (id: number) => setToasts((prev) => prev.filter((x) => x.id !== id));
  return (
    <ToastContext.Provider value={{ toasts, show, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className="bg-slate-900 text-white rounded px-4 py-2 shadow">
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm opacity-90">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
