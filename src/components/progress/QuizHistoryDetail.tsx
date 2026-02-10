import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Award,
  AlertCircle,
  Search,
} from "lucide-react";
import type { ModuleProgress } from "./types";
import type { ModuleProgressDetail } from "@/lib/api";

interface QuizHistoryDetailProps {
  modules: ModuleProgress[] | ModuleProgressDetail[];
}

export default function QuizHistoryDetail({ modules }: QuizHistoryDetailProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [expandedQuizGroup, setExpandedQuizGroup] = useState<Set<string>>(
    new Set(),
  ); // NEW: Track expanded quiz groups
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Use mock data if modules is empty
  const displayModules = modules.length > 0 ? modules : mockModulesData;

  // Filter modules based on search query
  const filteredModules = displayModules.filter((module) =>
    module.module_title.toLowerCase().includes(localSearchQuery.toLowerCase()),
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setExpandedQuiz(null); // Close any open quiz when switching modules
  };

  const toggleQuiz = (quizId: string) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  // NEW: Toggle quiz group (show/hide all attempts)
  const toggleQuizGroup = (quizId: string) => {
    setExpandedQuizGroup((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(quizId)) {
        newSet.delete(quizId);
      } else {
        newSet.add(quizId);
      }
      return newSet;
    });
  };

  // Define QuizAttemptType at component level
  type QuizAttemptType = {
    quiz_id: string;
    quiz_title: string;
    sub_materi_title?: string; // Sub-materi title for proper display
    is_attempted?: boolean;
    attempted_at?: string;
    passed?: boolean;
    score: number;
    total_questions: number;
    correct_answers: number;
    answers: Array<{
      question_id: string;
      question_text: string;
      user_answer: string;
      correct_answer: string;
      is_correct: boolean;
    }>;
  };

  // Calculate module statistics
  const getModuleStats = (module: ModuleProgress | ModuleProgressDetail) => {
    const attempts = module.quiz_attempts as unknown as QuizAttemptType[];
    const totalAttempts = attempts.filter(
      (a) => a.is_attempted !== false,
    ).length;
    const passedAttempts = attempts.filter(
      (a) => a.passed && a.is_attempted !== false,
    ).length;
    const avgScore =
      totalAttempts > 0
        ? Math.round(
            attempts
              .filter((a) => a.is_attempted !== false)
              .reduce((sum, a) => sum + a.score, 0) / totalAttempts,
          )
        : null; // null if no attempts

    return { totalAttempts, passedAttempts, avgScore };
  };

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-lg border-2 border-slate-200 p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg">
            <Search className="w-4 h-4 text-white" />
          </div>
          <input
            type="text"
            placeholder="Cari modul..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-[#578FCA] focus:border-[#578FCA] transition-all"
          />
          {localSearchQuery && (
            <button
              onClick={() => setLocalSearchQuery("")}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Module List */}
      {filteredModules.map((module) => {
        const stats = getModuleStats(module);
        const isExpanded = expandedModule === module.module_id;

        return (
          <div
            key={module.module_id}
            className="bg-gradient-to-br from-white to-slate-50/50 rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module.module_id)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-[#578FCA] to-[#27548A] rounded-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-semibold text-slate-800 text-sm md:text-base truncate">
                    {module.module_title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                    {stats.totalAttempts > 0 ? (
                      <>
                        <span className="font-medium">
                          {stats.totalAttempts} percobaan
                        </span>
                        <span className="font-medium">
                          {stats.passedAttempts} lulus
                        </span>
                        <span
                          className={`font-semibold ${
                            stats.avgScore! >= 70
                              ? "text-green-600"
                              : stats.avgScore! >= 50
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          Rata-rata: {stats.avgScore}%
                        </span>
                      </>
                    ) : (
                      <span className="font-medium text-slate-500 italic">
                        Belum ada percobaan kuis
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                  {isExpanded ? "Tutup" : "Lihat Detail"}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </div>
            </button>

            {/* Quiz List */}
            {isExpanded && (
              <div className="border-t-2 border-slate-200 bg-slate-50/30 p-3">
                <div className="space-y-2">
                  {/* Group quiz attempts by quiz_id and show ALL quizzes (including unattempted) */}
                  {(() => {
                    // Cast module.quiz_attempts to the correct type
                    const attempts =
                      module.quiz_attempts as unknown as QuizAttemptType[];

                    const groupedAttempts = attempts.reduce(
                      (acc: Record<string, QuizAttemptType[]>, attempt) => {
                        if (!acc[attempt.quiz_id]) {
                          acc[attempt.quiz_id] = [];
                        }
                        acc[attempt.quiz_id].push(attempt);
                        return acc;
                      },
                      {},
                    );

                    // Sort each group by date (newest first) and render
                    return Object.entries(groupedAttempts).map(
                      ([quizId, attempts]) => {
                        const sortedAttempts = attempts.sort(
                          (a, b) =>
                            new Date(b.attempted_at || "").getTime() -
                            new Date(a.attempted_at || "").getTime(),
                        );

                        // Check if quiz is attempted
                        const isAttempted = sortedAttempts.some(
                          (a) => a.is_attempted !== false,
                        );
                        const attemptCount = isAttempted
                          ? sortedAttempts.filter(
                              (a) => a.is_attempted !== false,
                            ).length
                          : 0;
                        const needsAttention = attemptCount > 5;

                        return (
                          <div
                            key={quizId}
                            className={`bg-white rounded-lg border-2 overflow-hidden ${
                              needsAttention
                                ? "border-yellow-400"
                                : "border-slate-200"
                            }`}
                          >
                            {/* Quiz Title Header */}
                            <button
                              onClick={() =>
                                isAttempted &&
                                sortedAttempts.length > 1 &&
                                toggleQuizGroup(quizId)
                              }
                              className={`w-full bg-gradient-to-r from-slate-50 to-slate-100 px-3 py-2 border-b-2 border-slate-200 text-left ${
                                isAttempted && sortedAttempts.length > 1
                                  ? "hover:from-slate-100 hover:to-slate-150 cursor-pointer"
                                  : "cursor-default"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="font-semibold text-slate-800 text-sm">
                                      {sortedAttempts[0].sub_materi_title ||
                                        sortedAttempts[0].quiz_title}
                                    </h5>
                                    {needsAttention && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-semibold rounded-full animate-pulse">
                                        <AlertCircle size={12} />
                                        Perlu Perhatian
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-600 mt-0.5">
                                    {isAttempted
                                      ? `${attemptCount} percobaan`
                                      : "Belum dikerjakan"}
                                  </p>
                                </div>
                                {isAttempted && sortedAttempts.length > 1 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-600">
                                      {expandedQuizGroup.has(quizId)
                                        ? "Sembunyikan"
                                        : "Lihat Semua"}
                                    </span>
                                    {expandedQuizGroup.has(quizId) ? (
                                      <ChevronUp className="w-4 h-4 text-slate-600" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-slate-600" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>

                            {/* Show content based on attempt status */}
                            {!isAttempted ? (
                              // Not attempted - show placeholder
                              <div className="p-4 text-center bg-slate-50">
                                <XCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                <p className="text-sm font-medium text-slate-600">
                                  Belum Dikerjakan
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  Kader belum mengerjakan kuis ini
                                </p>
                              </div>
                            ) : (
                              // Attempted - show attempts list
                              <div className="divide-y-2 divide-slate-200">
                                {/* Show only latest attempt by default, or all if expanded */}
                                {(expandedQuizGroup.has(quizId) ||
                                sortedAttempts.length === 1
                                  ? sortedAttempts
                                  : [sortedAttempts[0]]
                                )
                                  .filter((a) => a.is_attempted !== false)
                                  .map((attempt, attemptIndex) => {
                                    const actualIndex =
                                      expandedQuizGroup.has(quizId) ||
                                      sortedAttempts.length === 1
                                        ? attemptIndex
                                        : 0;

                                    return (
                                      <div
                                        key={`${attempt.quiz_id}-${attemptIndex}`}
                                        className="p-3"
                                      >
                                        <div className="flex items-center justify-between gap-3">
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
                                                Percobaan{" "}
                                                {attemptCount - actualIndex}
                                              </span>
                                              {attempt.passed ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full">
                                                  <CheckCircle size={12} />
                                                  Lulus
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold rounded-full">
                                                  <XCircle size={12} />
                                                  Tidak Lulus
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-xs text-slate-600">
                                              {new Date(
                                                attempt.attempted_at || "",
                                              ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1.5 text-xs">
                                              <span className="text-slate-600">
                                                Benar:{" "}
                                                <span className="font-bold text-green-600">
                                                  {attempt.correct_answers}
                                                </span>{" "}
                                                / {attempt.total_questions}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="text-right">
                                              <div
                                                className={`text-2xl md:text-3xl font-bold ${
                                                  attempt.passed
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                              >
                                                {attempt.score}%
                                              </div>
                                            </div>
                                            <button
                                              onClick={() =>
                                                toggleQuiz(
                                                  `${attempt.quiz_id}-${actualIndex}`,
                                                )
                                              }
                                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                              title="Lihat detail jawaban"
                                            >
                                              {expandedQuiz ===
                                              `${attempt.quiz_id}-${actualIndex}` ? (
                                                <ChevronUp className="w-5 h-5 text-slate-600" />
                                              ) : (
                                                <Eye className="w-5 h-5 text-slate-600" />
                                              )}
                                            </button>
                                          </div>
                                        </div>

                                        {/* Quiz Answers Detail */}
                                        {expandedQuiz ===
                                          `${attempt.quiz_id}-${actualIndex}` && (
                                          <div className="mt-3 pt-3 border-t-2 border-slate-200 bg-slate-50 -mx-3 -mb-3 p-3">
                                            <h6 className="text-xs md:text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                              <Award className="w-4 h-4 text-[#578FCA]" />
                                              Detail Jawaban
                                            </h6>
                                            <div className="space-y-2">
                                              {attempt.answers.map((answer) => (
                                                <div
                                                  key={answer.question_id}
                                                  className={`bg-white rounded-lg p-3 border-l-4 ${
                                                    answer.is_correct
                                                      ? "border-green-500 bg-green-50/30"
                                                      : "border-red-500 bg-red-50/30"
                                                  }`}
                                                >
                                                  <div className="flex items-start gap-2 mb-2">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                                                      {attempt.answers.indexOf(
                                                        answer,
                                                      ) + 1}
                                                    </span>
                                                    <p className="text-xs md:text-sm text-slate-900 font-medium flex-1">
                                                      {answer.question_text}
                                                    </p>
                                                    {answer.is_correct ? (
                                                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    ) : (
                                                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                                    )}
                                                  </div>
                                                  <div className="ml-8 space-y-1 text-xs md:text-sm">
                                                    <div className="flex items-start gap-2">
                                                      <span className="text-slate-600 min-w-[90px] font-medium">
                                                        Jawaban user:
                                                      </span>
                                                      <span
                                                        className={`font-semibold ${
                                                          answer.user_answer ===
                                                          "Tidak dijawab"
                                                            ? "text-slate-500 italic"
                                                            : answer.is_correct
                                                              ? "text-green-700"
                                                              : "text-red-700"
                                                        }`}
                                                      >
                                                        {answer.user_answer}
                                                      </span>
                                                    </div>
                                                    {!answer.is_correct && (
                                                      <div className="flex items-start gap-2">
                                                        <span className="text-slate-600 min-w-[90px] font-medium">
                                                          Jawaban benar:
                                                        </span>
                                                        <span className="font-semibold text-green-700">
                                                          {
                                                            answer.correct_answer
                                                          }
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        );
                      },
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* No Results */}
      {filteredModules.length === 0 && localSearchQuery && (
        <div className="text-center py-12 text-slate-500">
          <Search className="w-16 h-16 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium">Tidak ada modul ditemukan</p>
          <p className="text-xs italic mt-1">Coba kata kunci lain</p>
        </div>
      )}

      {displayModules.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <AlertCircle className="w-16 h-16 mx-auto mb-3 text-slate-300" />
          <p className="text-sm italic">Belum ada riwayat kuis</p>
        </div>
      )}
    </div>
  );
}

// Mock data untuk development
const mockModulesData: ModuleProgress[] = [
  {
    module_id: "1",
    module_title: "Gizi Balita",
    total_materials: 10,
    materials_read: 8,
    status: "in-progress",
    quizzes_passed: 2,
    total_quizzes: 3,
    last_accessed: "2026-02-05T10:30:00",
    overall_progress: 80,
    total_time_spent: 3600,
    quiz_attempts: [
      {
        quiz_id: "q1",
        quiz_title: "Kuis Gizi Balita - Bagian 1",
        score: 85,
        passed: true,
        attempted_at: "2026-02-05T10:30:00",
        total_questions: 10,
        correct_answers: 8,
        answers: [
          {
            question_id: "q1_1",
            question_text: "Apa yang dimaksud dengan gizi seimbang?",
            user_answer:
              "Makanan yang mengandung karbohidrat, protein, lemak, vitamin, dan mineral dalam jumlah yang tepat",
            correct_answer:
              "Makanan yang mengandung karbohidrat, protein, lemak, vitamin, dan mineral dalam jumlah yang tepat",
            is_correct: true,
          },
          {
            question_id: "q1_2",
            question_text:
              "Berapa kali minimal balita harus makan dalam sehari?",
            user_answer: "2 kali",
            correct_answer: "3 kali",
            is_correct: false,
          },
        ],
      },
      {
        quiz_id: "q2",
        quiz_title: "Kuis Gizi Balita - Bagian 2",
        score: 70,
        passed: true,
        attempted_at: "2026-02-04T14:20:00",
        total_questions: 10,
        correct_answers: 7,
        answers: [],
      },
    ],
  },
  {
    module_id: "2",
    module_title: "Imunisasi",
    total_materials: 8,
    materials_read: 5,
    status: "in-progress",
    quizzes_passed: 0,
    total_quizzes: 2,
    last_accessed: "2026-02-03T14:20:00",
    overall_progress: 62,
    total_time_spent: 2400,
    quiz_attempts: [
      {
        quiz_id: "q3",
        quiz_title: "Kuis Imunisasi - Bagian 1",
        score: 45,
        passed: false,
        attempted_at: "2026-02-03T14:20:00",
        total_questions: 10,
        correct_answers: 4,
        answers: [
          {
            question_id: "q3_1",
            question_text: "Kapan waktu pemberian imunisasi BCG?",
            user_answer: "Usia 2 bulan",
            correct_answer: "Segera setelah lahir atau maksimal usia 1 bulan",
            is_correct: false,
          },
          {
            question_id: "q3_2",
            question_text: "Apa fungsi imunisasi polio?",
            user_answer: "Mencegah penyakit polio",
            correct_answer: "Mencegah penyakit polio",
            is_correct: true,
          },
        ],
      },
    ],
  },
];
