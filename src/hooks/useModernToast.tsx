"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import ModernToast from "@/components/ui/ModernToast";

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export function useModernToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      type: "success" | "error" | "warning" | "info",
      title: string,
      message?: string,
      duration = 3000
    ) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("success", title, message, duration);
    },
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("error", title, message, duration);
    },
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("warning", title, message, duration);
    },
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast("info", title, message, duration);
    },
    [showToast]
  );

  const ToastContainer = useCallback(() => {
    if (typeof window === "undefined") return null;

    return createPortal(
      <>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              position: "fixed",
              top: `${24 + index * 100}px`,
              right: "24px",
              zIndex: 9999,
            }}
          >
            <ModernToast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </>,
      document.body
    );
  }, [toasts, removeToast]);

  return {
    success,
    error,
    warning,
    info,
    ToastContainer,
  };
}
