"use client";

import { useParams } from "next/navigation";
import QuizQuestionManager from "@/components/admin/QuizQuestionManager";

export default function NestedQuizQuestionPage() {
  const params = useParams();
  const moduleId = String(params?.id || "");
  const kuisId = String(params?.kuisId || "");

  if (!moduleId || !kuisId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            <h2 className="text-lg font-semibold mb-2">Parameter Tidak Valid</h2>
            <p>Module ID: {moduleId || 'Missing'}</p>
            <p>Kuis ID: {kuisId || 'Missing'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Quiz Question Manager */}
      <QuizQuestionManager kuisId={kuisId} />
    </div>
  );
}