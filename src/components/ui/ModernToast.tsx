"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

interface ModernToastProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

export default function ModernToast({
  type,
  title,
  message,
  duration = 3000,
  onClose,
}: ModernToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
      titleColor: "text-emerald-900",
      messageColor: "text-emerald-700",
      progressColor: "bg-emerald-500",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      messageColor: "text-red-700",
      progressColor: "bg-red-500",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      titleColor: "text-amber-900",
      messageColor: "text-amber-700",
      progressColor: "bg-amber-500",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      messageColor: "text-blue-700",
      progressColor: "bg-blue-500",
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] max-w-md w-full animate-slide-in-right`}
    >
      <div
        className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-2 rounded-xl shadow-2xl overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg ${currentConfig.bgColor} flex items-center justify-center`}
            >
              <Icon className={`w-6 h-6 ${currentConfig.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-bold ${currentConfig.titleColor} mb-1`}
              >
                {title}
              </h3>
              {message && (
                <p className={`text-sm ${currentConfig.messageColor}`}>
                  {message}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className={`flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors ${currentConfig.iconColor}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {duration > 0 && (
          <div className="h-1 bg-white/30">
            <div
              className={`h-full ${currentConfig.progressColor} animate-progress`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-progress {
          animation: progress linear;
        }
      `}</style>
    </div>
  );
}
