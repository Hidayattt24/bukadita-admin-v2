"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import UserProgressMonitoring from "@/components/progress/UserProgressMonitoring";

export default function ProgressPage() {
  return (
    <AdminLayout>
      <UserProgressMonitoring />
    </AdminLayout>
  );
}
