"use client";

import { use } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SendMessagePage from "@/components/messages/SendMessagePage";

export default function PesanPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);

  return (
    <AdminLayout>
      <SendMessagePage userId={userId} />
    </AdminLayout>
  );
}
