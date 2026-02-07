"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data dianggap fresh selama 5 menit
            staleTime: 5 * 60 * 1000,
            // Cache disimpan selama 10 menit
            gcTime: 10 * 60 * 1000,
            // Retry 1 kali jika gagal
            retry: 1,
            // Refetch saat window focus (optional, bisa dimatikan)
            refetchOnWindowFocus: false,
            // Refetch saat reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry 0 kali untuk mutations (create, update, delete)
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools hanya muncul di development */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}
