"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Edit,
  FileQuestion,
  Clock,
  Target,
  CheckCircle2,
  Lightbulb,
  Save,
  X as XIcon,
  BookOpen,
  TrendingUp,
  Settings2,
  Loader2,
} from "lucide-react";
import { quizzesAPI, type Quiz, type QuizQuestion } from "@/lib/api";
import { useModernToast } from "@/hooks/useModernToast";
import { useUpdateQuiz } from "@/hooks/useQuizzes";

type QuizRecord = Quiz;

interface QuizQuestionManagerProps {
  kuisId: string;
}

export default function QuizQuestionManager({ kuisId }: QuizQuestionManagerProps) {
  const router = useRouter();
  const { success, error, warning, ToastContainer } = useModernToast();
  const updateQuizMutation = useUpdateQuiz();
  const formRef = useRef<HTMLDivElement>(null);

  const [quiz, setQuiz] = useState<QuizRecord | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // "Questions to show" sidebar state
  const [questionsToShow, setQuestionsToShow] = useState<string>("");
  const [isEditingQuestionsToShow, setIsEditingQuestionsToShow] = useState(false);
  const [isSavingQuestionsToShow, setIsSavingQuestionsToShow] = useState(false);

  // Form state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saveAndContinueLoading, setSaveAndContinueLoading] = useState(false);

  /* ─── Load quiz ─── */
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const res = await quizzesAPI.get(kuisId);
        if (res.ok) {
          setQuiz(res.data);
          setQuestions(res.data.questions || []);
          setQuestionsToShow(
            res.data.questions_to_show ? String(res.data.questions_to_show) : ""
          );
        } else {
          error("Error", "Gagal memuat kuis");
        }
      } catch (err) {
        console.error(err);
        error("Error", "Terjadi kesalahan saat memuat kuis");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [kuisId, error]);

  /* ─── Scroll to form when it opens ─── */
  useEffect(() => {
    if ((showAddQuestion || showEditQuestion) && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [showAddQuestion, showEditQuestion]);

  /* ─── Helpers ─── */
  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setExplanation("");
    setEditingQuestion(null);
  };

  const handleSaveQuestionsToShow = async () => {
    if (!kuisId || !quiz) return;
    const value = questionsToShow.trim() ? parseInt(questionsToShow) : undefined;
    if (value !== undefined) {
      if (isNaN(value)) { error("Input Tidak Valid", "Masukkan angka yang valid"); return; }
      if (value < 1) { error("Input Tidak Valid", "Jumlah soal minimal 1"); return; }
      if (value > questions.length) {
        error("Melebihi Batas", `Hanya ada ${questions.length} soal tersedia.`);
        return;
      }
    }
    setIsSavingQuestionsToShow(true);
    try {
      const result = await updateQuizMutation.mutateAsync({
        id: kuisId,
        data: { questions_to_show: value },
      });
      setQuiz(result);
      setIsEditingQuestionsToShow(false);
      success("Berhasil Disimpan!", "Pengaturan soal diperbarui", 2000);
    } catch (err) {
      error("Error", err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSavingQuestionsToShow(false);
    }
  };

  const loadQuestionToForm = (q: QuizQuestion) => {
    setQuestionText(q.question_text);
    setOptions([...q.options]);
    setCorrectIndex(q.correct_answer_index);
    setExplanation(q.explanation || "");
    setEditingQuestion(q);
  };

  const addOption = () => { if (options.length < 6) setOptions([...options, ""]); };
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const n = options.filter((_, i) => i !== index);
      setOptions(n);
      if (correctIndex >= n.length) setCorrectIndex(n.length - 1);
    }
  };
  const updateOption = (index: number, value: string) => {
    const n = [...options];
    n[index] = value;
    setOptions(n);
  };

  const validateAndGetPayload = () => {
    if (!questionText.trim()) { warning("Peringatan", "Teks pertanyaan harus diisi"); return null; }
    if (questionText.trim().length < 10) { warning("Peringatan", "Pertanyaan minimal 10 karakter"); return null; }
    if (!options[correctIndex]?.trim()) { warning("Peringatan", "Opsi jawaban benar tidak boleh kosong"); return null; }
    const validOptions = options.filter((o) => o.trim());
    if (validOptions.length < 2) { warning("Peringatan", "Minimal 2 opsi jawaban"); return null; }
    let adjIdx = correctIndex; let vi = 0;
    for (let i = 0; i <= correctIndex && i < options.length; i++) {
      if (options[i].trim()) { if (i === correctIndex) { adjIdx = vi; break; } vi++; }
    }
    if (adjIdx >= validOptions.length) { warning("Peringatan", "Jawaban benar tidak valid"); return null; }
    return {
      question_text: questionText.trim(),
      options: validOptions,
      correct_answer_index: adjIdx,
      explanation: explanation.trim() || undefined,
    };
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kuisId) { error("Error", "ID kuis tidak valid"); return; }
    const payload = validateAndGetPayload();
    if (!payload) return;
    setSubmitting(true);
    try {
      const res = await quizzesAPI.addQuestion(kuisId, { ...payload, order_index: questions.length + 1 });
      if (res.ok) {
        const qr = await quizzesAPI.get(kuisId);
        if (qr.ok) { setQuiz(qr.data); setQuestions(qr.data.questions || []); }
        resetForm();
        setShowAddQuestion(false);
        success("Berhasil", "Pertanyaan ditambahkan", 2000);
      } else { error("Error", res.error || "Gagal menambah pertanyaan"); }
    } catch { error("Error", "Terjadi kesalahan"); }
    finally { setSubmitting(false); }
  };

  const handleAddQuestionAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kuisId) { error("Error", "ID kuis tidak valid"); return; }
    const payload = validateAndGetPayload();
    if (!payload) return;
    setSaveAndContinueLoading(true);
    setSubmitting(true);
    try {
      const res = await quizzesAPI.addQuestion(kuisId, { ...payload, order_index: questions.length + 1 });
      if (res.ok) {
        const qr = await quizzesAPI.get(kuisId);
        if (qr.ok) { setQuiz(qr.data); setQuestions(qr.data.questions || []); }
        resetForm();
        success("Berhasil!", "Pertanyaan ditambahkan. Silakan tambah lagi.", 2000);
      } else { error("Error", res.error || "Gagal menambah pertanyaan"); }
    } catch { error("Error", "Terjadi kesalahan"); }
    finally { setSubmitting(false); setSaveAndContinueLoading(false); }
  };

  const handleEditQuestion = (q: QuizQuestion) => {
    loadQuestionToForm(q);
    setShowEditQuestion(true);
    setShowAddQuestion(false);
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    const payload = validateAndGetPayload();
    if (!payload) return;
    setSubmitting(true);
    try {
      const res = await quizzesAPI.updateQuestion(editingQuestion.id, payload);
      if (res.ok) {
        const qr = await quizzesAPI.get(kuisId);
        if (qr.ok) { setQuiz(qr.data); setQuestions(qr.data.questions || []); }
        resetForm();
        setShowEditQuestion(false);
        success("Berhasil", "Pertanyaan diperbarui", 2000);
      } else { error("Error", res.error || "Gagal memperbarui"); }
    } catch { error("Error", "Terjadi kesalahan"); }
    finally { setSubmitting(false); }
  };

  const handleCancelEdit = () => { resetForm(); setShowEditQuestion(false); };

  const handleDeleteQuestion = async (q: QuizQuestion) => {
    const r = await Swal.fire({
      title: "Hapus Pertanyaan?",
      text: `"${q.question_text.slice(0, 50)}..." akan dihapus permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (r.isConfirmed) {
      try {
        const res = await quizzesAPI.removeQuestion(q.id);
        if (res.ok) {
          const qr = await quizzesAPI.get(kuisId);
          if (qr.ok) { setQuiz(qr.data); setQuestions(qr.data.questions || []); }
          success("Berhasil", "Pertanyaan dihapus", 2000);
        } else { error("Error", "Gagal menghapus pertanyaan"); }
      } catch { error("Error", "Terjadi kesalahan"); }
    }
  };

  /* ─── Loading / Not Found states ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center animate-pulse shadow-lg">
            <FileQuestion className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500 font-medium">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
            <XIcon className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 font-medium">Kuis tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const timeMins = Math.floor((quiz.time_limit_seconds || quiz.time_limit || 1800) / 60);
  const isFormOpen = showAddQuestion || showEditQuestion;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      {/* ── Global transition styles for form slide-in ── */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .form-enter { animation: slideDown 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .fade-in    { animation: fadeIn 0.2s ease both; }
        .btn-press:active { transform: scale(0.96); }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-3 sm:space-y-5">

        {/* ── Back button ── */}
        <button
          onClick={() => router.back()}
          className="btn-press inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        {/* ── Split layout ── */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">

          {/* ════════════════════════════════
              LEFT — Main content
          ════════════════════════════════ */}
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">

            {/* Quiz title card */}
            <div className="bg-white rounded-2xl px-3 sm:px-5 py-3 sm:py-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center flex-shrink-0 shadow-md">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-[#578FCA] uppercase tracking-wider mb-0.5">
                  Manajemen Soal Kuis
                </p>
                <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">{quiz.title}</h1>
                {quiz.description && (
                  <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{quiz.description}</p>
                )}
              </div>
            </div>

            {/* Header row: Daftar Pertanyaan + Tambah button */}
            {!showEditQuestion && (
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-700 flex items-center gap-2 min-w-0">
                  <span className="truncate">Daftar Pertanyaan</span>
                  <span className="flex-shrink-0 px-2 py-0.5 bg-[#578FCA]/10 text-[#27548A] text-xs font-bold rounded-full">
                    {questions.length}
                  </span>
                </h2>
                <button
                  onClick={() => { setShowAddQuestion(!showAddQuestion); if (showAddQuestion) resetForm(); }}
                  className="btn-press flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md"
                >
                  {showAddQuestion
                    ? <><XIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>Tutup</span></>
                    : <><Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>Tambah Soal</span></>
                  }
                </button>
              </div>
            )}

            {/* ── Add / Edit Form ── */}
            {isFormOpen && (
              <div ref={formRef} className="form-enter">
                <form
                  onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden"
                >
                  {/* Form header */}
                  <div className={`px-3 sm:px-5 py-3 flex items-center gap-2.5 ${editingQuestion
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-[#578FCA] to-[#27548A]"
                    }`}>
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                      {editingQuestion
                        ? <Edit className="w-4 h-4 text-white" />
                        : <Plus className="w-4 h-4 text-white" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white text-sm sm:text-base truncate">
                        {editingQuestion ? "Edit Pertanyaan" : "Tambah Pertanyaan Baru"}
                      </h3>
                      <p className="text-white/70 text-xs hidden sm:block">
                        {editingQuestion ? "Perbarui informasi pertanyaan" : "Lengkapi form berikut"}
                      </p>
                    </div>
                  </div>

                  {/* Form body */}
                  <div className="p-3 sm:p-5 space-y-4">

                    {/* Teks Pertanyaan */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                        Teks Pertanyaan <span className="text-red-500">*</span>
                        <span className="text-xs font-normal text-gray-400 ml-1">(min. 10 karakter)</span>
                      </label>
                      <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#578FCA] resize-none text-gray-900 text-sm placeholder-gray-400 bg-gray-50 focus:bg-white"
                        rows={3}
                        placeholder="Masukkan pertanyaan yang jelas dan spesifik..."
                        required
                      />
                    </div>

                    {/* Opsi Jawaban */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                        Opsi Jawaban <span className="text-red-500">*</span>
                        <span className="text-xs font-normal text-gray-400 ml-1 hidden sm:inline">
                          — klik baris untuk tandai jawaban benar
                        </span>
                      </label>
                      {/* Hint for mobile */}
                      <p className="text-[11px] text-gray-400 mb-2 sm:hidden">
                        Ketuk baris opsi untuk menjadikannya jawaban benar
                      </p>
                      <div className="space-y-2">
                        {options.map((option, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl border-2 transition-colors ${correctIndex === index
                              ? "border-[#578FCA] bg-blue-50"
                              : "border-gray-200 bg-gray-50"
                              }`}
                          >
                            {/* Radio – tap to select */}
                            <input
                              type="radio"
                              name="correct_answer"
                              checked={correctIndex === index}
                              onChange={() => setCorrectIndex(index)}
                              className="w-4 h-4 accent-[#578FCA] cursor-pointer flex-shrink-0"
                            />
                            {/* Letter badge */}
                            <span
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${correctIndex === index
                                ? "bg-[#578FCA] text-white"
                                : "bg-white text-gray-500 border border-gray-300"
                                }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            {/* Text input */}
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateOption(index, e.target.value)}
                              className="flex-1 bg-transparent text-sm text-gray-900 focus:outline-none placeholder-gray-400 min-w-0"
                              placeholder={`Opsi ${String.fromCharCode(65 + index)}...`}
                            />
                            {/* Correct indicator */}
                            {correctIndex === index && (
                              <CheckCircle2 className="w-4 h-4 text-[#578FCA] flex-shrink-0" />
                            )}
                            {/* Remove button */}
                            {options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="p-1.5 text-red-400 hover:text-red-600 flex-shrink-0 rounded-lg hover:bg-red-50"
                                title="Hapus opsi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {options.length < 6 && (
                        <button
                          type="button"
                          onClick={addOption}
                          className="btn-press inline-flex items-center gap-1.5 text-[#578FCA] text-xs font-bold mt-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah Opsi
                        </button>
                      )}
                    </div>

                    {/* Penjelasan */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-1.5">
                        Penjelasan{" "}
                        <span className="text-gray-400 font-normal">(opsional)</span>
                      </label>
                      <textarea
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#578FCA] resize-none text-gray-900 text-sm placeholder-gray-400 bg-gray-50 focus:bg-white"
                        rows={2}
                        placeholder="Jelaskan mengapa jawaban tersebut benar..."
                      />
                    </div>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="px-3 sm:px-5 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
                    {/* On mobile: stack vertically, full width each */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-2.5">
                      {/* Simpan & Tambah Lagi — Add mode only */}
                      {!editingQuestion && (
                        <button
                          type="button"
                          onClick={handleAddQuestionAndContinue}
                          disabled={submitting}
                          className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-60"
                        >
                          {saveAndContinueLoading
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                            : <><Plus className="w-4 h-4" /> Simpan &amp; Tambah Lagi</>
                          }
                        </button>
                      )}

                      {/* Row: Simpan + Batal side by side on mobile */}
                      <div className="flex gap-2 sm:contents">
                        {/* Simpan / Perbarui */}
                        <button
                          type="submit"
                          disabled={submitting}
                          className={`btn-press flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 text-white text-sm font-semibold rounded-xl shadow-sm disabled:opacity-60 ${editingQuestion
                            ? "bg-amber-500"
                            : "bg-gradient-to-r from-[#578FCA] to-[#27548A]"
                            }`}
                        >
                          {submitting && !saveAndContinueLoading
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                            : <><Save className="w-4 h-4" /> {editingQuestion ? "Perbarui" : "Simpan"}</>
                          }
                        </button>

                        {/* Batal */}
                        <button
                          type="button"
                          onClick={editingQuestion
                            ? handleCancelEdit
                            : () => { resetForm(); setShowAddQuestion(false); }}
                          disabled={submitting}
                          className="btn-press flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border-2 border-gray-200 disabled:opacity-60"
                        >
                          <XIcon className="w-4 h-4" /> Batal
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* ── Question List — Timeline Style ── */}
            <div id="question-list">
              {questions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center fade-in">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-semibold text-sm mb-1">Belum ada pertanyaan</p>
                  <p className="text-xs text-gray-400">Tambah pertanyaan pertama untuk memulai kuis.</p>
                </div>
              ) : (
                <div className="fade-in space-y-3">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="relative flex items-start gap-2.5 sm:gap-3 group"
                    >
                      {/* Timeline connector line */}
                      {index < questions.length - 1 && (
                        <div className="absolute left-[15px] sm:left-[19px] top-9 sm:top-10 bottom-[-12px] w-0.5 bg-gradient-to-b from-[#578FCA]/20 to-transparent pointer-events-none" />
                      )}

                      {/* Number node */}
                      <div className="flex-shrink-0 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md mt-0.5">
                        <span className="text-white font-bold text-xs">{index + 1}</span>
                      </div>

                      {/* Card */}
                      <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:border-[#578FCA]/30 group-hover:shadow-md overflow-hidden">

                        {/* Card top: question text + action buttons */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start gap-2 mb-2.5">
                            <p className="flex-1 text-sm font-semibold text-gray-900 leading-relaxed min-w-0">
                              {question.question_text}
                            </p>
                            {/* Action buttons: always visible, no hover-hide on mobile */}
                            <div className="flex-shrink-0 flex items-center gap-1">
                              <button
                                onClick={() => handleEditQuestion(question)}
                                className="btn-press p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question)}
                                className="btn-press p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Options — single column on mobile, 2-col on sm+ */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {question.options.map((option, optIndex) => {
                              const isCorrect = optIndex === question.correct_answer_index;
                              return (
                                <div
                                  key={optIndex}
                                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs ${isCorrect
                                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold"
                                    : "bg-gray-50 border border-gray-200 text-gray-600"
                                    }`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black ${isCorrect
                                      ? "bg-emerald-500 text-white"
                                      : "bg-white border border-gray-300 text-gray-500"
                                      }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  {/* Use break-words to avoid text overflow on narrow mobile */}
                                  <span className="flex-1 break-words leading-snug">{option}</span>
                                  {isCorrect && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-50 border-t border-blue-100">
                            <Lightbulb className="w-3.5 h-3.5 text-[#578FCA] flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">
                              <span className="font-bold text-[#27548A]">Penjelasan: </span>
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ════════════════════════════════
              RIGHT — Sticky Sidebar
          ════════════════════════════════ */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 order-first lg:order-last">
            <div className="lg:sticky lg:top-6 space-y-3 sm:space-y-4">

              {/* ── Quiz Info Card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-[#27548A] to-[#578FCA] px-4 py-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-white/80" />
                  <h3 className="text-sm font-bold text-white">Informasi Kuis</h3>
                </div>

                {/* On mobile: 3-column horizontal stats grid; on lg+: vertical list */}
                <div className="grid grid-cols-3 lg:grid-cols-1 divide-x lg:divide-x-0 divide-y-0 lg:divide-y divide-gray-100 border-b lg:border-b-0 border-gray-100">
                  {/* Waktu */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between p-3 lg:px-4 lg:py-2.5 gap-1 lg:gap-2 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 text-gray-600">
                      <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-[#578FCA]" />
                      </div>
                      <span className="text-[10px] lg:text-xs font-semibold leading-tight">Waktu</span>
                    </div>
                    <span className="text-sm lg:text-base font-extrabold text-gray-900">
                      {timeMins}<span className="text-[10px] lg:text-xs font-semibold text-gray-400 ml-0.5">mnt</span>
                    </span>
                  </div>

                  {/* Nilai lulus */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between p-3 lg:px-4 lg:py-2.5 gap-1 lg:gap-2 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 text-gray-600">
                      <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-[10px] lg:text-xs font-semibold leading-tight">Lulus</span>
                    </div>
                    <span className="text-sm lg:text-base font-extrabold text-emerald-700">
                      {quiz.passing_score || 70}<span className="text-[10px] lg:text-xs font-semibold text-gray-400 ml-0.5">%</span>
                    </span>
                  </div>

                  {/* Total soal */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between p-3 lg:px-4 lg:py-2.5 gap-1 lg:gap-2 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2 text-gray-600">
                      <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <FileQuestion className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-purple-600" />
                      </div>
                      <span className="text-[10px] lg:text-xs font-semibold leading-tight">Total Soal</span>
                    </div>
                    <span className="text-sm lg:text-base font-extrabold text-gray-900">
                      {questions.length}<span className="text-[10px] lg:text-xs font-semibold text-gray-400 ml-0.5">soal</span>
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 space-y-1">

                  {/* ── Tampil ke Peserta ── */}
                  <div className="pt-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">Tampil ke Peserta</span>
                      </div>
                      {!isEditingQuestionsToShow && (
                        <button
                          onClick={() => setIsEditingQuestionsToShow(true)}
                          className="btn-press p-1.5 text-[#578FCA] hover:bg-blue-50 rounded-lg border border-blue-100"
                          title="Ubah jumlah soal"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {isEditingQuestionsToShow ? (
                      <div className="space-y-2 fade-in">
                        <div className="flex items-stretch gap-2">
                          <div className="flex-1 relative">
                            <input
                              type="number"
                              value={questionsToShow}
                              onChange={(e) => setQuestionsToShow(e.target.value)}
                              min="1"
                              max={questions.length}
                              placeholder="Masukkan angka..."
                              autoFocus
                              className="w-full px-3 py-2.5 text-sm font-bold text-gray-900 border-2 border-amber-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white placeholder-gray-400"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                              / {questions.length}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 px-0.5">
                          Kosongkan untuk menampilkan semua soal.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveQuestionsToShow}
                            disabled={isSavingQuestionsToShow}
                            className="btn-press flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl disabled:opacity-50"
                          >
                            {isSavingQuestionsToShow
                              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menyimpan</>
                              : <><Save className="w-3.5 h-3.5" /> Simpan</>
                            }
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingQuestionsToShow(false);
                              setQuestionsToShow(quiz.questions_to_show ? String(quiz.questions_to_show) : "");
                            }}
                            className="btn-press flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-white text-gray-700 text-xs font-bold rounded-xl border-2 border-gray-200 hover:border-gray-300"
                          >
                            <XIcon className="w-3.5 h-3.5" /> Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="fade-in px-3 py-3 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xl font-black text-amber-900 leading-none">
                            {quiz.questions_to_show || "Semua"}
                          </p>
                          <p className="text-xs text-amber-600 font-semibold mt-0.5">
                            {quiz.questions_to_show ? "soal per sesi" : "soal ditampilkan"}
                          </p>
                        </div>
                        {quiz.questions_to_show && quiz.questions_to_show < questions.length && (
                          <div className="text-right">
                            <p className="text-xs text-amber-700 font-semibold">dari</p>
                            <p className="text-base font-black text-amber-800">{questions.length}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Quick Actions Card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-700">Aksi Cepat</h3>
                </div>
                <button
                  onClick={() => {
                    setShowAddQuestion(!showAddQuestion);
                    setShowEditQuestion(false);
                    if (showAddQuestion) resetForm();
                  }}
                  className="btn-press w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg mb-2"
                >
                  {showAddQuestion || showEditQuestion
                    ? <><XIcon className="w-4 h-4" /> Tutup Form</>
                    : <><Plus className="w-4 h-4" /> Tambah Pertanyaan</>
                  }
                </button>
                <p className="text-center text-xs text-gray-400 mt-1">
                  {questions.length === 0
                    ? "Belum ada soal ditambahkan"
                    : `${questions.length} soal sudah tersedia`
                  }
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
