"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookCheck,
  Clock,
  Target,
  FileQuestion,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { Quiz } from "@/lib/api";

interface QuizPreviewModalProps {
  quiz: Quiz | null;
  onClose: () => void;
}

export default function QuizPreviewModal({
  quiz,
  onClose,
}: QuizPreviewModalProps) {
  if (!quiz) return null;

  const questions = quiz.questions || [];
  const timeInMinutes = Math.floor((quiz.time_limit_seconds || 1800) / 60);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#578FCA] to-[#27548A] p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shrink-0">
                  <BookCheck className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-blue-100 text-sm font-medium mb-1">
                    Preview Kuis
                  </div>
                  <h2 className="text-xl font-bold truncate">{quiz.title}</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors shrink-0 ml-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quiz Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <FileQuestion className="w-4 h-4" />
                <div>
                  <div className="text-xs text-blue-100">Soal</div>
                  <div className="font-bold">{questions.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <div>
                  <div className="text-xs text-blue-100">Waktu</div>
                  <div className="font-bold">{timeInMinutes} Menit</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Target className="w-4 h-4" />
                <div>
                  <div className="text-xs text-blue-100">Passing</div>
                  <div className="font-bold">{quiz.passing_score || 70}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {/* Description */}
            {quiz.description && (
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Kuis
                </h3>
                <p className="text-gray-600 text-sm">{quiz.description}</p>
              </div>
            )}

            {/* Questions Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Daftar Pertanyaan ({questions.length})
              </h3>

              {questions.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    Belum Ada Pertanyaan
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Tambahkan pertanyaan untuk melengkapi kuis ini
                  </p>
                </div>
              ) : (
                questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {question.question_text}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 ml-11">
                      {question.options.map((option, optIndex) => {
                        const isCorrect =
                          optIndex === question.correct_answer_index;
                        return (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-300"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                isCorrect
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-gray-300 bg-white text-gray-600"
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}
                            </div>
                            <span
                              className={`flex-1 text-sm ${
                                isCorrect
                                  ? "text-emerald-900 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {option}
                            </span>
                            {isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-4 ml-11 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-blue-800 mb-1">
                              Penjelasan:
                            </p>
                            <p className="text-sm text-blue-700">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    quiz.published
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {quiz.published ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Published
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Draft
                    </>
                  )}
                </span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white font-medium hover:shadow-lg transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
