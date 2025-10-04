"use client";

import { useParams } from "next/navigation";
import MaterialPoinManager from "@/components/admin/MaterialPoinManager";

export default function MaterialPoinPage() {
  const params = useParams();
  const materialId = String(params?.materialId || "");

  if (!materialId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">ID Materi tidak valid</div>
        </div>
      </div>
    );
  }

  return <MaterialPoinManager materialId={materialId} />;
}