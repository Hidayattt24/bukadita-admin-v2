"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Trash2, UserPlus, UserCheck } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface CustomToastProps {
  type: "success" | "error" | "warning" | "delete" | "create" | "update";
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

export default function CustomToast({
  type,
  title,
  message,
  duration = 3000,
  onClose,
}: CustomToastProps) {
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasClosedRef = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        if (newProgress <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          if (!hasClosedRef.current) {
            hasClosedRef.current = true;
            setTimeout(() => onClose(), 0);
          }
          return 0;
        }
        return newProgress;
      });
    }, 50);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [duration, onClose]);

  const handleClose = () => {
    if (!hasClosedRef.current) {
      hasClosedRef.current = true;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onClose();
    }
  };

  const getConfig = () => {
    switch (type) {
      case "delete":
        return {
          icon: Trash2,
          gradient: "from-red-500 to-rose-600",
          bgGradient: "from-red-50 to-rose-50",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          progressColor: "bg-red-500",
          borderColor: "border-red-200",
        };
      case "create":
        return {
          icon: UserPlus,
          gradient: "from-emerald-500 to-green-600",
          bgGradient: "from-emerald-50 to-green-50",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          progressColor: "bg-emerald-500",
          borderColor: "border-emerald-200",
        };
      case "update":
        return {
          icon: UserCheck,
          gradient: "from-blue-500 to-indigo-600",
          bgGradient: "from-blue-50 to-indigo-50",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          progressColor: "bg-blue-500",
          borderColor: "border-blue-200",
        };
      case "success":
        return {
          icon: CheckCircle,
          gradient: "from-emerald-500 to-green-600",
          bgGradient: "from-emerald-50 to-green-50",
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          progressColor: "bg-emerald-500",
          borderColor: "border-emerald-200",
        };
      case "error":
        return {
          icon: XCircle,
          gradient: "from-red-500 to-rose-600",
          bgGradient: "from-red-50 to-rose-50",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          progressColor: "bg-red-500",
          borderColor: "border-red-200",
        };
      case "warning":
        return {
          icon: AlertCircle,
          gradient: "from-amber-500 to-orange-600",
          bgGradient: "from-amber-50 to-orange-50",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          progressColor: "bg-amber-500",
          borderColor: "border-amber-200",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`fixed top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 left-3 sm:left-auto z-[9999] sm:w-80 md:w-96 bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl border-2 ${config.borderColor} rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} animate-pulse`}></div>
      </div>

      {/* Content */}
      <div className="relative p-3 sm:p-4 md:p-5">
        <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
          {/* Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className={`${config.iconBg} p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0`}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${config.iconColor}`} />
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-sm sm:text-base md:text-lg font-bold text-slate-800 mb-0.5 sm:mb-1 truncate"
            >
              {title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 sm:p-1 hover:bg-white/50 rounded-md sm:rounded-lg flex-shrink-0"
          >
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 sm:mt-3 md:mt-4 h-1 sm:h-1.5 bg-white/50 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${config.progressColor} rounded-full`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: "linear" }}
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-xl"></div>
    </motion.div>
  );
}
