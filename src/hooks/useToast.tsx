"use client";

import { useState, useCallback, useRef } from "react";
import CustomToast from "@/components/ui/CustomToast";

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "delete" | "create" | "update";
  title: string;
  message: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback(
    (
      type: Toast["type"],
      title: string,
      message: string,
      duration: number = 3000
    ) => {
      const id = toastIdRef.current++;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (title: string, message: string, duration?: number) =>
      showToast("success", title, message, duration),
    error: (title: string, message: string, duration?: number) =>
      showToast("error", title, message, duration),
    warning: (title: string, message: string, duration?: number) =>
      showToast("warning", title, message, duration),
    delete: (title: string, message: string, duration?: number) =>
      showToast("delete", title, message, duration),
    create: (title: string, message: string, duration?: number) =>
      showToast("create", title, message, duration),
    update: (title: string, message: string, duration?: number) =>
      showToast("update", title, message, duration),
  };

  const ToastContainer = () => (
    <div className="fixed top-0 right-0 z-[9999] p-4 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((t) => (
          <CustomToast
            key={t.id}
            type={t.type}
            title={t.title}
            message={t.message}
            duration={t.duration}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  );

  return { toast, ToastContainer };
}
