"use client";

import { useParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import ModernMaterialsPage from "@/components/modules/ModernMaterialsPage";

export default function ModulMateriPage() {
  const params = useParams();
  const moduleId = String(params?.id || "");

  return (
    <AdminLayout>
      <ModernMaterialsPage moduleId={moduleId} />
    </AdminLayout>
  );
}
