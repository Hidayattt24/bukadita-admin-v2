"use client";

import { useParams } from "next/navigation";
import MaterialPoinManager from "@/components/admin/MaterialPoinManager";

export default function NestedMaterialPoinPage() {
  const params = useParams();
  const moduleId = String(params?.id || "");
  const materialId = String(params?.materialId || "");

  if (!moduleId || !materialId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            <h2 className="text-lg font-semibold mb-2">Parameter Tidak Valid</h2>
            <p>Module ID: {moduleId || "Missing"}</p>
            <p>Material ID: {materialId || "Missing"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Poin Management */}
      <MaterialPoinManager materialId={materialId} />
    </div>
  );
}