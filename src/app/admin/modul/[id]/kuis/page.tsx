"use client";

import { useParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import ModernQuizzesPage from "@/components/modules/ModernQuizzesPage";

export default function ModulKuisPage() {
  const params = useParams();
  const moduleId = String(params?.id || "");

  return (
    <AdminLayout>
      <ModernQuizzesPage moduleId={moduleId} />
    </AdminLayout>
  );
}
