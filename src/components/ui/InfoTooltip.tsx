"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoTooltipProps {
  title: string;
  content: string;
  example?: string;
}

export default function InfoTooltip({ title, content, example }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Info Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-blue-100 hover:bg-blue-200 text-[#27548A] transition-all hover:scale-110"
        aria-label="Informasi lebih lanjut"
      >
        <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setIsOpen(false)}
            />

            {/* Popup Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-[90vw] sm:w-[400px] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border-2 border-[#27548A]/20">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#27548A] to-[#578FCA] p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">
                        {title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 md:p-5">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                    {content}
                  </p>

                  {example && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-2.5 sm:p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-200 flex items-center justify-center">
                            <span className="text-[10px] sm:text-xs font-bold text-[#27548A]">💡</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs font-semibold text-[#27548A] mb-1">
                            Contoh:
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed">
                            {example}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-3 sm:mt-4 w-full px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all font-semibold text-xs sm:text-sm"
                  >
                    Mengerti
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
