"use client";

import { useParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import QuizQuestionManager from "@/components/quizzes/QuizQuestionManager";

export default function SoalQuizPage() {
  const params = useParams();
  const kuisId = String(params?.kuisId || "");

  return (
    <AdminLayout>
      <QuizQuestionManager kuisId={kuisId} />
    </AdminLayout>
  );
}
