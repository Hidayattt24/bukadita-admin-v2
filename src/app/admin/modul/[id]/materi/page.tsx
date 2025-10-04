"use client";

import { useParams } from "next/navigation";
import ModuleItemsPage from "@/components/admin/shared/ModuleItemsPage";

export default function ModulMateriPage() {
  const params = useParams();
  const moduleId = String(params?.id || "");
  return <ModuleItemsPage moduleId={moduleId} resource="materi" />;
}
