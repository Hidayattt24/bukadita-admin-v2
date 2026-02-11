"use client";

import { useEffect, useState } from "react";
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
  X as XIcon
} from "lucide-react";
import { quizzesAPI, type Quiz, type QuizQuestion } from "@/lib/api";
import { useModernToast } from "@/hooks/useModernToast";

// Alias for backward compatibility
type QuizRecord = Quiz;

interface QuizQuestionManagerProps {
  kuisId: string;
}

export default function QuizQuestionManager({ kuisId }: QuizQuestionManagerProps) {
  const router = useRouter();
  const { success, error, warning, ToastContainer } = useModernToast();
  const [quiz, setQuiz] = useState<QuizRecord | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestion, setShowEditQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Add/Edit question form state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Custom radio button styles
  const radioButtonStyles = `
    input[type="radio"].custom-radio {
      appearance: none;
      -webkit-appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid #d1d5db;
      border-radius: 50%;
      outline: none;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }
    
    input[type="radio"].custom-radio:hover {
      border-color: #578FCA;
    }
    
    input[type="radio"].custom-radio:checked {
      border-color: #578FCA;
      background-color: #578FCA;
    }
    
    input[type="radio"].custom-radio:checked::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background-color: white;
    }
    
    input[type="radio"].custom-radio:focus {
      box-shadow: 0 0 0 3px rgba(87, 143, 202, 0.3);
    }
  `;

  // Load quiz and questions
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const res = await quizzesAPI.get(kuisId);
        if (res.ok) {
          setQuiz(res.data);
          setQuestions(res.data.questions || []);
        } else {
          error("Error", "Gagal memuat kuis");
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
        error("Error", "Terjadi kesalahan saat memuat kuis");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [kuisId, error]);

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setExplanation("");
    setEditingQuestion(null);
  };

  const loadQuestionToForm = (question: QuizQuestion) => {
    setQuestionText(question.question_text);
    setOptions([...question.options]);
    setCorrectIndex(question.correct_answer_index);
    setExplanation(question.explanation || "");
    setEditingQuestion(question);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correctIndex >= newOptions.length) {
        setCorrectIndex(newOptions.length - 1);
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kuisId) {
      error("Error", "ID kuis tidak valid");
      return;
    }

    if (!questionText.trim()) {
      warning("Peringatan", "Teks pertanyaan harus diisi");
      return;
    }

    if (questionText.trim().length < 10) {
      warning("Peringatan", "Pertanyaan harus minimal 10 karakter");
      return;
    }

    // Validate that the selected correct answer is not empty
    if (!options[correctIndex] || !options[correctIndex].trim()) {
      warning("Peringatan", "Opsi jawaban yang dipilih sebagai benar tidak boleh kosong");
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      warning("Peringatan", "Minimal harus ada 2 opsi jawaban");
      return;
    }

    // Check if the correct_answer_index is valid for the filtered options
    let adjustedCorrectIndex = correctIndex;

    // Find the actual index in validOptions array
    let validIndex = 0;
    for (let i = 0; i <= correctIndex && i < options.length; i++) {
      if (options[i].trim()) {
        if (i === correctIndex) {
          adjustedCorrectIndex = validIndex;
          break;
        }
        validIndex++;
      }
    }

    if (adjustedCorrectIndex >= validOptions.length) {
      warning("Peringatan", "Jawaban benar tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        question_text: questionText.trim(),
        options: validOptions,
        correct_answer_index: adjustedCorrectIndex,
        explanation: explanation.trim() || undefined,
        order_index: questions.length + 1,
      };

      const res = await quizzesAPI.addQuestion(kuisId, payload);

      if (res.ok) {
        // Reload quiz to get updated questions
        const quizRes = await quizzesAPI.get(kuisId);
        if (quizRes.ok) {
          setQuiz(quizRes.data);
          setQuestions(quizRes.data.questions || []);
        }
        resetForm();
        setShowAddQuestion(false);
        success("Berhasil", "Pertanyaan berhasil ditambahkan", 2000);
      } else {
        console.error('Failed to add question:', res);

        let errorMessage = 'Gagal menambah pertanyaan';
        let errorDetails = '';

        if (res.status === 422) {
          errorMessage = 'Data pertanyaan tidak valid';
          if (res.raw && typeof res.raw === 'object') {
            const rawError = res.raw as Record<string, unknown>;
            if (rawError.message) {
              errorDetails = String(rawError.message);
            } else if (rawError.errors) {
              errorDetails = JSON.stringify(rawError.errors);
            }
          }
        }

        const finalMessage = errorDetails ? `${errorDetails}` : (res.error || errorMessage);
        error("Error", finalMessage);
      }
    } catch (err) {
      console.error('Error adding question:', err);
      error("Error", "Terjadi kesalahan saat menambah pertanyaan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddQuestionAndContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kuisId) {
      error("Error", "ID kuis tidak valid");
      return;
    }

    if (!questionText.trim()) {
      warning("Peringatan", "Teks pertanyaan harus diisi");
      return;
    }

    if (questionText.trim().length < 10) {
      warning("Peringatan", "Pertanyaan harus minimal 10 karakter");
      return;
    }

    // Validate that the selected correct answer is not empty
    if (!options[correctIndex] || !options[correctIndex].trim()) {
      warning("Peringatan", "Opsi jawaban yang dipilih sebagai benar tidak boleh kosong");
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      warning("Peringatan", "Minimal harus ada 2 opsi jawaban");
      return;
    }

    // Check if the correct_answer_index is valid for the filtered options
    let adjustedCorrectIndex = correctIndex;

    // Find the actual index in validOptions array
    let validIndex = 0;
    for (let i = 0; i <= correctIndex && i < options.length; i++) {
      if (options[i].trim()) {
        if (i === correctIndex) {
          adjustedCorrectIndex = validIndex;
          break;
        }
        validIndex++;
      }
    }

    if (adjustedCorrectIndex >= validOptions.length) {
      warning("Peringatan", "Jawaban benar tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        question_text: questionText.trim(),
        options: validOptions,
        correct_answer_index: adjustedCorrectIndex,
        explanation: explanation.trim() || undefined,
        order_index: questions.length + 1,
      };

      const res = await quizzesAPI.addQuestion(kuisId, payload);

      if (res.ok) {
        // Reload quiz to get updated questions
        const quizRes = await quizzesAPI.get(kuisId);
        if (quizRes.ok) {
          setQuiz(quizRes.data);
          setQuestions(quizRes.data.questions || []);
        }
        resetForm();
        // Keep form open for adding another question
        success("Berhasil", "Pertanyaan berhasil ditambahkan. Silakan tambah pertanyaan lagi.", 2000);
      } else {
        console.error('Failed to add question:', res);

        let errorMessage = 'Gagal menambah pertanyaan';
        let errorDetails = '';

        if (res.status === 422) {
          errorMessage = 'Data pertanyaan tidak valid';
          if (res.raw && typeof res.raw === 'object') {
            const rawError = res.raw as Record<string, unknown>;
            if (rawError.message) {
              errorDetails = String(rawError.message);
            } else if (rawError.errors) {
              errorDetails = JSON.stringify(rawError.errors);
            }
          }
        }

        const finalMessage = errorDetails ? `${errorDetails}` : (res.error || errorMessage);
        error("Error", finalMessage);
      }
    } catch (err) {
      console.error('Error adding question:', err);
      error("Error", "Terjadi kesalahan saat menambah pertanyaan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    loadQuestionToForm(question);
    setShowEditQuestion(true);
    setShowAddQuestion(false); // Hide add form if open
  };

  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingQuestion) return;

    if (!questionText.trim()) {
      warning("Peringatan", "Teks pertanyaan harus diisi");
      return;
    }

    if (questionText.trim().length < 10) {
      warning("Peringatan", "Pertanyaan harus minimal 10 karakter");
      return;
    }

    // Validate that the selected correct answer is not empty
    if (!options[correctIndex] || !options[correctIndex].trim()) {
      warning("Peringatan", "Opsi jawaban yang dipilih sebagai benar tidak boleh kosong");
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      warning("Peringatan", "Minimal harus ada 2 opsi jawaban");
      return;
    }

    // Check if the correct_answer_index is valid for the filtered options
    let adjustedCorrectIndex = correctIndex;

    // Find the actual index in validOptions array
    let validIndex = 0;
    for (let i = 0; i <= correctIndex && i < options.length; i++) {
      if (options[i].trim()) {
        if (i === correctIndex) {
          adjustedCorrectIndex = validIndex;
          break;
        }
        validIndex++;
      }
    }

    if (adjustedCorrectIndex >= validOptions.length) {
      warning("Peringatan", "Jawaban benar tidak valid");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        question_text: questionText.trim(),
        options: validOptions,
        correct_answer_index: adjustedCorrectIndex,
        explanation: explanation.trim() || undefined,
      };

      const res = await quizzesAPI.updateQuestion(editingQuestion.id, payload);

      if (res.ok) {
        // Reload quiz to get updated questions
        const quizRes = await quizzesAPI.get(kuisId);
        if (quizRes.ok) {
          setQuiz(quizRes.data);
          setQuestions(quizRes.data.questions || []);
        }
        resetForm();
        setShowEditQuestion(false);
        success("Berhasil", "Pertanyaan berhasil diperbarui", 2000);
      } else {
        console.error('Failed to update question:', res);

        let errorMessage = 'Gagal memperbarui pertanyaan';
        let errorDetails = '';

        if (res.status === 422) {
          errorMessage = 'Data pertanyaan tidak valid';
          if (res.raw && typeof res.raw === 'object') {
            const rawError = res.raw as Record<string, unknown>;
            if (rawError.message) {
              errorDetails = String(rawError.message);
            } else if (rawError.errors) {
              errorDetails = JSON.stringify(rawError.errors);
            }
          }
        }

        const finalMessage = errorDetails ? `${errorDetails}` : (res.error || errorMessage);
        error("Error", finalMessage);
      }
    } catch (err) {
      console.error('Error updating question:', err);
      error("Error", "Terjadi kesalahan saat memperbarui pertanyaan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setShowEditQuestion(false);
  };

  const handleDeleteQuestion = async (question: QuizQuestion) => {
    const result = await Swal.fire({
      title: 'Hapus Pertanyaan?',
      text: `Pertanyaan "${question.question_text.slice(0, 50)}..." akan dihapus.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      try {
        const res = await quizzesAPI.removeQuestion(question.id);
        if (res.ok) {
          // Reload quiz
          const quizRes = await quizzesAPI.get(kuisId);
          if (quizRes.ok) {
            setQuiz(quizRes.data);
            setQuestions(quizRes.data.questions || []);
          }
          success("Berhasil", "Pertanyaan berhasil dihapus", 2000);
        } else {
          error("Error", "Gagal menghapus pertanyaan");
        }
      } catch (err) {
        console.error('Error deleting question:', err);
        error("Error", "Terjadi kesalahan saat menghapus pertanyaan");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center animate-pulse">
                <FileQuestion className="w-8 h-8 text-white" />
              </div>
              <div className="text-gray-600 font-medium">Memuat kuis...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <XIcon className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-red-600 font-medium">Kuis tidak ditemukan</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Custom Radio Button Styles */}
      <style jsx>{radioButtonStyles}</style>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#578FCA] hover:to-[#27548A] rounded-lg transition-all mb-6 border border-gray-200 hover:border-transparent shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Kembali</span>
          </button>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-lg">
                <FileQuestion className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                {quiz.description && (
                  <p className="text-gray-600">{quiz.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-[#578FCA]" />
                <span className="text-sm font-medium text-gray-700">
                  {Math.floor((quiz.time_limit_seconds || quiz.time_limit || 1800) / 60)} Menit
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">
                  Nilai Lulus: {quiz.passing_score || 70}%
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <FileQuestion className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">
                  {questions.length} Pertanyaan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Question Button */}
        {!showEditQuestion && (
          <div className="mb-6">
            <button
              onClick={() => {
                setShowAddQuestion(!showAddQuestion);
                if (showAddQuestion) {
                  resetForm();
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#578FCA] to-[#27548A] hover:shadow-lg text-white rounded-xl shadow-md transition-all font-medium"
            >
              {showAddQuestion ? (
                <>
                  <XIcon className="w-5 h-5" />
                  Tutup Form
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Tambah Pertanyaan
                </>
              )}
            </button>
          </div>
        )}

        {/* Add/Edit Question Form */}
        {(showAddQuestion || showEditQuestion) && (
          <form onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${editingQuestion ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-[#578FCA] to-[#27548A]'}`}>
                {editingQuestion ? <Edit className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingQuestion ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingQuestion ? 'Perbarui informasi pertanyaan' : 'Lengkapi form untuk menambah pertanyaan'}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Pertanyaan <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-500 ml-2">(minimal 10 karakter)</span>
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#578FCA] focus:border-[#27548A] transition-all resize-none text-gray-900"
                  rows={3}
                  placeholder="Masukkan pertanyaan (minimal 10 karakter)..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Opsi Jawaban <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-500 ml-2">(pilih salah satu sebagai jawaban benar)</span>
                </label>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="flex-shrink-0">
                        <input
                          type="radio"
                          name="correct_answer"
                          checked={correctIndex === index}
                          onChange={() => setCorrectIndex(index)}
                          className="custom-radio"
                          title="Pilih sebagai jawaban benar"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${
                            correctIndex === index
                              ? 'border-[#578FCA] bg-blue-50 focus:ring-[#578FCA] focus:border-[#27548A]'
                              : 'border-gray-200 focus:ring-[#578FCA] focus:border-[#27548A]'
                          }`}
                          placeholder={`Opsi ${String.fromCharCode(65 + index)}...`}
                        />
                        {correctIndex === index && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <CheckCircle2 className="w-5 h-5 text-[#578FCA]" />
                          </div>
                        )}
                      </div>
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Hapus opsi"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex items-center gap-2 text-[#578FCA] hover:text-[#27548A] text-sm font-semibold mt-3 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Opsi
                  </button>
                )}
                <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-[#578FCA] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-900">
                    Klik radio button di sebelah kiri opsi untuk menandai jawaban yang benar
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Penjelasan <span className="text-gray-500 font-normal">(opsional)</span>
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#578FCA] focus:border-[#27548A] transition-all resize-none text-gray-900"
                  rows={2}
                  placeholder="Penjelasan jawaban yang benar..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
              {!editingQuestion && (
                <button
                  type="button"
                  onClick={handleAddQuestionAndContinue}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg text-white rounded-xl font-medium shadow-md transition-all disabled:opacity-60"
                >
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Menyimpan...' : 'Simpan & Tambah Lagi'}
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-md transition-all disabled:opacity-60 ${
                  editingQuestion
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg'
                    : 'bg-gradient-to-r from-[#578FCA] to-[#27548A] hover:shadow-lg'
                }`}
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Menyimpan...' : (editingQuestion ? 'Perbarui Pertanyaan' : 'Simpan Pertanyaan')}
              </button>
              <button
                type="button"
                onClick={editingQuestion ? handleCancelEdit : () => {
                  resetForm();
                  setShowAddQuestion(false);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                <XIcon className="w-4 h-4" />
                Batal
              </button>
            </div>
          </form>
        )}

        {/* Questions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#578FCA] to-[#27548A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <FileQuestion className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Daftar Pertanyaan</h2>
                  <p className="text-sm text-white/80">{questions.length} pertanyaan tersedia</p>
                </div>
              </div>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Eye className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-gray-600 font-medium mb-2">Belum ada pertanyaan</p>
              <p className="text-sm text-gray-500">Klik &quot;Tambah Pertanyaan&quot; untuk mulai membuat kuis.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {questions.map((question, index) => (
                <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Question Number Badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#578FCA] to-[#27548A] flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        {question.question_text}
                      </h3>
                      
                      {/* Options */}
                      <div className="space-y-2 mb-3">
                        {question.options.map((option, optIndex) => {
                          const isCorrect = optIndex === question.correct_answer_index;
                          return (
                            <div 
                              key={optIndex} 
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                isCorrect 
                                  ? 'bg-emerald-50 border-emerald-300' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-semibold text-sm ${
                                isCorrect 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-white text-gray-600 border-2 border-gray-300'
                              }`}>
                                {String.fromCharCode(65 + optIndex)}
                              </div>
                              <span className={`flex-1 text-sm ${
                                isCorrect ? 'text-emerald-900 font-medium' : 'text-gray-700'
                              }`}>
                                {option}
                              </span>
                              {isCorrect && (
                                <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Benar
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Lightbulb className="w-5 h-5 text-[#578FCA] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-[#27548A] mb-1">Penjelasan:</p>
                            <p className="text-sm text-gray-700">{question.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}