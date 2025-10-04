"use client";

import { useParams } from "next/navigation";
import QuizQuestionManager from "@/components/admin/QuizQuestionManager";

export default function QuizQuestionsPage() {
  const params = useParams();
  const quizId = String(params?.quizId || "");

  if (!quizId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">ID Kuis tidak valid</div>
        </div>
      </div>
    );
  }

  return <QuizQuestionManager quizId={quizId} />;
}