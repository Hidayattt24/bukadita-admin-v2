"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ArrowLeft, Plus, Trash2, Eye, Edit } from "lucide-react";
import { quizService, type QuizRecord, type QuizQuestion } from "@/lib/api/quiz";

interface QuizQuestionManagerProps {
  kuisId: string;
}

export default function QuizQuestionManager({ kuisId }: QuizQuestionManagerProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizRecord | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  // Add question form state
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load quiz and questions
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      try {
        const res = await quizService.get(kuisId);
        if (res.ok) {
          setQuiz(res.data);
          setQuestions(res.data.questions || []);
        } else {
          await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memuat kuis' });
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat memuat kuis' });
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [kuisId]);

  const resetForm = () => {
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setExplanation("");
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
      await Swal.fire({ icon: 'error', title: 'Error', text: 'ID kuis tidak valid' });
      return;
    }

    if (!questionText.trim()) {
      await Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Teks pertanyaan harus diisi' });
      return;
    }

    if (questionText.trim().length < 10) {
      await Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Pertanyaan harus minimal 10 karakter' });
      return;
    }

    // Validate that the selected correct answer is not empty
    if (!options[correctIndex] || !options[correctIndex].trim()) {
      await Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Opsi jawaban yang dipilih sebagai benar tidak boleh kosong' });
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      await Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Minimal harus ada 2 opsi jawaban' });
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
      await Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Jawaban benar tidak valid' });
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

      // Debug logging (can be removed in production)
      console.log('Adding question payload:', payload);

      const res = await quizService.addQuestion(kuisId, payload);
      console.log('Add question response:', res);

      if (res.ok) {
        // Reload quiz to get updated questions
        const quizRes = await quizService.get(kuisId);
        if (quizRes.ok) {
          setQuiz(quizRes.data);
          setQuestions(quizRes.data.questions || []);
        }
        resetForm();
        setShowAddQuestion(false);
        await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pertanyaan berhasil ditambahkan', timer: 1500, showConfirmButton: false });
      } else {
        console.error('Failed to add question:', res);
        console.error('Raw error response:', res.raw);

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

        const finalMessage = errorDetails ? `${errorMessage}: ${errorDetails}` : (res.error || errorMessage);

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: finalMessage,
          footer: `Status: ${res.status}`
        });
      }
    } catch (error) {
      console.error('Error adding question:', error);
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat menambah pertanyaan' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditQuestion = async (question: QuizQuestion) => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: 'Edit Pertanyaan',
      html: `
        <div class="text-left text-black">
          <label class="block text-sm font-medium mb-1">Pertanyaan:</label>
          <textarea id="edit-question" class="swal2-textarea" placeholder="Masukkan pertanyaan...">${question.question_text}</textarea>
          
          <label class="block text-sm font-medium mb-1 mt-3">Penjelasan (opsional):</label>
          <textarea id="edit-explanation" class="swal2-textarea" placeholder="Penjelasan jawaban...">${question.explanation || ''}</textarea>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const questionText = (document.getElementById('edit-question') as HTMLTextAreaElement)?.value?.trim();
        const explanation = (document.getElementById('edit-explanation') as HTMLTextAreaElement)?.value?.trim();

        if (!questionText) {
          Swal.showValidationMessage('Pertanyaan harus diisi');
          return null;
        }

        return {
          question_text: questionText,
          explanation: explanation || undefined,
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      width: 600,
    });

    if (isConfirmed && formValues) {
      try {
        const res = await quizService.updateQuestion(question.id, formValues);
        if (res.ok) {
          // Reload quiz
          const quizRes = await quizService.get(kuisId);
          if (quizRes.ok) {
            setQuiz(quizRes.data);
            setQuestions(quizRes.data.questions || []);
          }
          await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pertanyaan berhasil diperbarui', timer: 1500, showConfirmButton: false });
        } else {
          await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memperbarui pertanyaan' });
        }
      } catch (error) {
        console.error('Error updating question:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat memperbarui pertanyaan' });
      }
    }
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
    });

    if (result.isConfirmed) {
      try {
        const res = await quizService.removeQuestion(question.id);
        if (res.ok) {
          // Reload quiz
          const quizRes = await quizService.get(kuisId);
          if (quizRes.ok) {
            setQuiz(quizRes.data);
            setQuestions(quizRes.data.questions || []);
          }
          await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pertanyaan berhasil dihapus', timer: 1500, showConfirmButton: false });
        } else {
          await Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menghapus pertanyaan' });
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat menghapus pertanyaan' });
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Memuat kuis...</div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Kuis tidak ditemukan</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600 mb-4">{quiz.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {quiz.time_limit_seconds && (
              <span>Batas Waktu: {Math.floor(quiz.time_limit_seconds / 60)} menit</span>
            )}
            {quiz.passing_score && (
              <span>Nilai Lulus: {quiz.passing_score}%</span>
            )}
            <span>{questions.length} Pertanyaan</span>
          </div>
        </div>
      </div>

      {/* Add Question Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddQuestion(!showAddQuestion)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Pertanyaan
        </button>
      </div>

      {/* Add Question Form */}
      {showAddQuestion && (
        <form onSubmit={handleAddQuestion} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tambah Pertanyaan Baru</h2>

          <div className="space-y-4 text-black">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pertanyaan *<span className="text-xs"> (minimal 10 karakter)</span></label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Masukkan pertanyaan (minimal 10 karakter)..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opsi Jawaban *</label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="correct_answer"
                    checked={correctIndex === index}
                    onChange={() => setCorrectIndex(index)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Opsi ${index + 1}...`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOption}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Tambah Opsi
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penjelasan (opsional)</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
                placeholder="Penjelasan jawaban yang benar..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors disabled:opacity-60"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Pertanyaan'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowAddQuestion(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Pertanyaan ({questions.length})</h2>
        </div>

        {questions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada pertanyaan. Klik &quot;Tambah Pertanyaan&quot; untuk mulai membuat kuis.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <div key={question.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                      {index + 1}. {question.question_text}
                    </h3>
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`flex items-center gap-2 text-sm ${optIndex === question.correct_answer_index ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                          <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          {option}
                          {optIndex === question.correct_answer_index && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-2">
                              Benar
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Penjelasan:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}